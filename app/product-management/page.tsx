"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import NavigationDrawer from "@/components/navigation-drawer";
import BottomNavBar from "@/components/bottom-nav-bar";
import TopAppBar from "@/components/top-app-bar";
import StatusBadge from "@/components/commerce/status-badge";

const seedInventoryItems = [
  {
    id: "inv-01",
    name: "Terra Speaker",
    sku: "VEL-1042",
    category: "Audio",
    price: "$320",
    stock: 12,
    status: "Active",
    image: "https://images.unsplash.com/photo-1518441902117-f0a52b1b8d9c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "inv-02",
    name: "Halo Lamp",
    sku: "VEL-2011",
    category: "Lighting",
    price: "$180",
    stock: 8,
    status: "Low stock",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "inv-03",
    name: "Echo Desk Dock",
    sku: "VEL-3099",
    category: "Accessories",
    price: "$95",
    stock: 0,
    status: "Out of stock",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80",
  },
] as const;

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

interface CloudinarySignatureResponse {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
  message?: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
}

export default function ProductManagementPage() {
  const [inventoryItems, setInventoryItems] = useState<ProductRow[]>(
    seedInventoryItems.map((item) => ({
      ...item,
      price: Number(item.price.replace("$", "")),
    })),
  );
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [productMessage, setProductMessage] = useState<string | null>(null);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<ProductRow> | null>(null);
  const [deleteDeleting, setDeleteDeleting] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
  });
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);

        const response = await fetch("/api/products", { cache: "no-store" });
        const payload = (await response.json()) as {
          items?: ProductRow[];
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Unable to load products.");
        }

        if (payload.items && payload.items.length > 0) {
          setInventoryItems(payload.items);
        }
      } catch (error) {
        setProductsError(error instanceof Error ? error.message : "Unable to load products.");
      } finally {
        setProductsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const onFileChange = (file: File | null) => {
    setUploadError(null);
    setUploadedUrl(null);
    setSelectedFile(file);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (file) {
      const nextPreview = URL.createObjectURL(file);
      previewUrlRef.current = nextPreview;
      setPreviewUrl(nextPreview);
      return;
    }

    setPreviewUrl(null);
  };

  const uploadToCloudinary = async () => {
    if (!selectedFile) {
      setUploadError("Please choose an image before uploading.");
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      const signatureResponse = await fetch("/api/uploads/cloudinary-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folder: "veltron/products",
        }),
      });

      const signaturePayload = (await signatureResponse.json()) as CloudinarySignatureResponse;

      if (!signatureResponse.ok) {
        throw new Error(signaturePayload.message ?? "Unable to prepare upload.");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", signaturePayload.apiKey);
      formData.append("timestamp", String(signaturePayload.timestamp));
      formData.append("signature", signaturePayload.signature);
      formData.append("folder", signaturePayload.folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const uploadPayload = (await uploadResponse.json()) as CloudinaryUploadResponse;

      if (!uploadResponse.ok || !uploadPayload.secure_url) {
        throw new Error(uploadPayload.error?.message ?? "Image upload failed.");
      }

      setUploadedUrl(uploadPayload.secure_url);
      setProductForm((current) => ({ ...current, imageUrl: uploadPayload.secure_url ?? "" }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onProductFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setProductForm((current) => ({ ...current, [name]: value }));
  };

  const createProduct = async () => {
    try {
      setProductSubmitting(true);
      setProductMessage(null);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productForm.name,
          sku: productForm.sku,
          category: productForm.category,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          imageUrl: productForm.imageUrl,
          description: productForm.description,
        }),
      });

      const payload = (await response.json()) as {
        id?: string;
        name?: string;
        sku?: string;
        category?: string;
        price?: number;
        stock?: number;
        image?: string;
        message?: string;
      };

      const productId = payload.id;
      const productPrice = payload.price;
      const productStock = payload.stock;
      const productImage = payload.image;

      if (!response.ok || !productId || productPrice == null || productStock == null || !productImage) {
        throw new Error(payload.message ?? "Unable to create product.");
      }

      setInventoryItems((current) => [
        {
          id: productId,
          name: payload.name ?? "",
          sku: payload.sku ?? "",
          category: payload.category ?? "",
          price: productPrice,
          stock: productStock,
          image: productImage,
        },
        ...current,
      ]);

      setProductMessage("Product created successfully.");
      setProductForm({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        imageUrl: "",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadedUrl(null);
    } catch (error) {
      setProductMessage(error instanceof Error ? error.message : "Unable to create product.");
    } finally {
      setProductSubmitting(false);
    }
  };

  const updateProduct = async (productId: string) => {
    if (!editingData) return;

    try {
      setProductSubmitting(true);
      setProductMessage(null);

      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingData.name,
          sku: editingData.sku,
          category: editingData.category,
          price: editingData.price,
          stock: editingData.stock,
          imageUrl: editingData.image,
          description: "",
        }),
      });

      const payload = (await response.json()) as {
        id?: string;
        name?: string;
        sku?: string;
        category?: string;
        price?: number;
        stock?: number;
        image?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to update product.");
      }

      setInventoryItems((current) =>
        current.map((item) =>
          item.id === productId
            ? {
                ...item,
                name: payload.name ?? item.name,
                sku: payload.sku ?? item.sku,
                category: payload.category ?? item.category,
                price: payload.price ?? item.price,
                stock: payload.stock ?? item.stock,
                image: payload.image ?? item.image,
              }
            : item,
        ),
      );

      setProductMessage("Product updated successfully.");
      setEditingId(null);
      setEditingData(null);
    } catch (error) {
      setProductMessage(error instanceof Error ? error.message : "Unable to update product.");
    } finally {
      setProductSubmitting(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeleteDeleting(productId);

      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? "Unable to delete product.");
      }

      setInventoryItems((current) => current.filter((item) => item.id !== productId));
      setProductMessage("Product deleted successfully.");
    } catch (error) {
      setProductMessage(error instanceof Error ? error.message : "Unable to delete product.");
    } finally {
      setDeleteDeleting(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationDrawer activeHref="/product-management" />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopAppBar activeHref="/product-management" showNavigation={false} title="Veltron" />
        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <section className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Inventory management</p>
                <h1 className="mt-4 font-heading text-4xl text-text-primary sm:text-5xl">Product Management</h1>
              </div>
              <Link href="#" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background transition hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add product
              </Link>
            </section>

            <section className="mb-8 grid gap-4 rounded-lg border border-border bg-background p-5 sm:grid-cols-[1.4fr_1fr_1fr]">
              <label className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3">
                <Search className="h-4 w-4 text-text-muted" />
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted/60" placeholder="Search products" />
              </label>
              <select className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none">
                <option>All categories</option>
                <option>Audio</option>
                <option>Lighting</option>
                <option>Accessories</option>
              </select>
              <select className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none">
                <option>All status</option>
                <option>Active</option>
                <option>Low stock</option>
                <option>Out of stock</option>
              </select>
            </section>

            <section className="mb-8 rounded-lg border border-border bg-background p-6 sm:p-8">
              <div className="flex flex-wrap items-start gap-6">
                <div className="min-w-65 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Media upload</p>
                  <h2 className="mt-3 font-heading text-2xl text-text-primary">Upload Product Image</h2>
                  <p className="mt-2 text-sm text-text-muted">Signed Cloudinary upload for admin product media.</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer rounded-md border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-text-primary transition hover:border-primary">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        void uploadToCloudinary();
                      }}
                      disabled={!selectedFile || uploading}
                      className="rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-background transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  {selectedFile ? <p className="mt-3 text-xs text-text-muted">Selected: {selectedFile.name}</p> : null}
                  {uploadError ? <p className="mt-3 text-sm text-danger">{uploadError}</p> : null}
                  {uploadedUrl ? (
                    <p className="mt-3 break-all text-xs text-text-muted">
                      Uploaded URL: {uploadedUrl}
                    </p>
                  ) : null}
                </div>

                <div className="w-full max-w-xs overflow-hidden rounded-md border border-border bg-surface">
                  {previewUrl ? (
                    <Image width={150} height={150} src={previewUrl} alt="Selected upload preview" className="h-56 w-full object-cover" />
                  ) : (
                    <div className="flex h-56 items-center justify-center text-xs uppercase tracking-[0.2em] text-text-muted">
                      No preview
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="mb-8 rounded-lg border border-border bg-background p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Create product</p>
              <h2 className="mt-3 font-heading text-2xl text-text-primary">Add Product to Catalog</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  value={productForm.name}
                  onChange={onProductFieldChange}
                  placeholder="Product name"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
                />
                <input
                  name="sku"
                  value={productForm.sku}
                  onChange={onProductFieldChange}
                  placeholder="SKU"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
                />
                <input
                  name="category"
                  value={productForm.category}
                  onChange={onProductFieldChange}
                  placeholder="Category"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
                />
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={onProductFieldChange}
                  placeholder="Price"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
                />
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={onProductFieldChange}
                  placeholder="Stock"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
                />
                <input
                  name="imageUrl"
                  value={productForm.imageUrl}
                  onChange={onProductFieldChange}
                  placeholder="Image URL (or upload above)"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
                />
              </div>
              <textarea
                name="description"
                value={productForm.description}
                onChange={onProductFieldChange}
                placeholder="Product description"
                className="mt-4 min-h-24 w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
              />
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    void createProduct();
                  }}
                  disabled={productSubmitting}
                  className="rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-background transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {productSubmitting ? "Saving..." : "Save Product"}
                </button>
                {productMessage ? <p className="text-sm text-text-muted">{productMessage}</p> : null}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-background p-6 sm:p-8">
              {productsLoading ? <p className="mb-4 text-sm text-text-muted">Loading products...</p> : null}
              {productsError ? <p className="mb-4 text-sm text-danger">{productsError}</p> : null}
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-[10px] uppercase tracking-[0.24em] text-text-muted">
                      <th className="pb-4 pr-4 font-semibold">Product</th>
                      <th className="pb-4 pr-4 font-semibold">SKU</th>
                      <th className="pb-4 pr-4 font-semibold">Category</th>
                      <th className="pb-4 pr-4 font-semibold">Price</th>
                      <th className="pb-4 pr-4 font-semibold">Stock</th>
                      <th className="pb-4 pr-4 font-semibold">Status</th>
                      <th className="pb-4 pr-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryItems.map((item) => (
                      <tr key={item.id} className="border-b border-border/60 hover:bg-surface/70">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded bg-surface">
                              <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                            </div>
                            {editingId === item.id ? (
                              <input
                                type="text"
                                value={editingData?.name ?? item.name}
                                onChange={(e) => setEditingData((prev) => ({ ...prev, name: e.target.value }))}
                                className="rounded border border-border bg-surface px-2 py-1 text-sm"
                              />
                            ) : (
                              <span className="font-medium text-text-primary">{item.name}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-text-muted">{item.sku}</td>
                        <td className="py-4 pr-4 text-text-muted">{item.category}</td>
                        <td className="py-4 pr-4 font-medium text-text-primary">${item.price.toFixed(2)}</td>
                        <td className="py-4 pr-4 text-text-muted">{item.stock}</td>
                        <td className="py-4 pr-4">
                          <StatusBadge
                            status={item.stock === 0 ? "Out of stock" : item.stock < 10 ? "Low stock" : "Active"}
                          />
                        </td>
                        <td className="py-4 pr-4 flex items-center gap-2">
                          {editingId === item.id ? (
                            <>
                              <button
                                onClick={() => {
                                  void updateProduct(item.id);
                                }}
                                disabled={productSubmitting}
                                className="rounded bg-primary px-2 py-1 text-xs text-background hover:bg-primary/90 disabled:opacity-60"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditingData(null);
                                }}
                                className="rounded border border-border px-2 py-1 text-xs hover:bg-surface"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingId(item.id);
                                  setEditingData({ ...item });
                                }}
                                className="rounded border border-border p-1 text-text-muted hover:bg-surface"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  void deleteProduct(item.id);
                                }}
                                disabled={deleteDeleting === item.id}
                                className="rounded border border-danger p-1 text-danger hover:bg-danger/10 disabled:opacity-60"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
      <BottomNavBar activeHref="/product-management" />
    </div>
  );
}