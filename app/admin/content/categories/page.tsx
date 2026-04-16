"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Save, Trash2 } from "lucide-react";
import NavigationDrawer from "@/components/navigation-drawer";
import TopAppBar from "@/components/top-app-bar";
import BottomNavBar from "@/components/bottom-nav-bar";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  isActive: true,
  sortOrder: "0",
};

export default function AdminCategoriesContentPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories", { cache: "no-store" });
      const payload = (await response.json()) as { items?: CategoryRow[]; message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to load categories.");
      }

      setCategories(payload.items ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const createCategory = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          imageUrl: form.imageUrl,
          isActive: form.isActive,
          sortOrder: Number(form.sortOrder),
        }),
      });

      const payload = (await response.json()) as CategoryRow & { message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to create category.");
      }

      setCategories((current) => [...current, payload].sort((a, b) => a.sortOrder - b.sortOrder));
      setForm(emptyForm);
      setMessage("Category created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create category.");
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = async (category: CategoryRow) => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });

      const payload = (await response.json()) as CategoryRow & { message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to update category.");
      }

      setCategories((current) =>
        current
          .map((item) => (item.id === category.id ? payload : item))
          .sort((a, b) => a.sortOrder - b.sortOrder),
      );
      setMessage("Category updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update category.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to delete category.");
      }

      setCategories((current) => current.filter((item) => item.id !== categoryId));
      setMessage("Category deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationDrawer activeHref="/admin/content/categories" />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopAppBar activeHref="/admin/content/categories" showNavigation={false} title="Veltron" />

        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Content management</p>
                <h1 className="mt-4 font-heading text-4xl text-text-primary sm:text-5xl">Categories</h1>
              </div>
              <Link href="/admin/settings" className="text-xs uppercase tracking-[0.22em] text-primary">
                Back to settings
              </Link>
            </section>

            {message ? (
              <p className="mb-6 rounded-md border border-border bg-surface px-4 py-3 text-sm text-text-primary">{message}</p>
            ) : null}

            <section className="rounded-lg border border-border bg-background p-6 shadow-sm">
              <h2 className="font-heading text-2xl text-text-primary">Add New Category</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Category name"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
                />
                <input
                  value={form.slug}
                  onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                  placeholder="Slug (audio)"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
                />
                <input
                  value={form.imageUrl}
                  onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                  placeholder="Image URL"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none md:col-span-2"
                />
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Description"
                  className="min-h-24 rounded-md border border-border bg-background px-4 py-3 text-sm outline-none md:col-span-2"
                />
                <div className="flex items-center gap-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-text-muted">Sort</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(event) => setForm((current) => ({ ...current, sortOrder: event.target.value }))}
                    className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                  />
                </div>
                <label className="flex items-center gap-3 text-sm text-text-primary">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                  />
                  Active
                </label>
              </div>
              <button
                type="button"
                onClick={() => void createCategory()}
                disabled={saving}
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                Create category
              </button>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="font-heading text-3xl text-text-primary">Existing Categories</h2>
              {loading ? <p className="text-sm text-text-muted">Loading categories...</p> : null}

              {!loading && categories.length === 0 ? (
                <p className="rounded-lg border border-border bg-surface p-5 text-sm text-text-muted">No categories yet.</p>
              ) : null}

              {categories.map((category) => (
                <article key={category.id} className="rounded-lg border border-border bg-background p-5 shadow-sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={category.name}
                      onChange={(event) =>
                        setCategories((current) =>
                          current.map((item) =>
                            item.id === category.id ? { ...item, name: event.target.value } : item,
                          ),
                        )
                      }
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                    />
                    <input
                      value={category.slug}
                      onChange={(event) =>
                        setCategories((current) =>
                          current.map((item) =>
                            item.id === category.id ? { ...item, slug: event.target.value } : item,
                          ),
                        )
                      }
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                    />
                    <input
                      value={category.imageUrl}
                      onChange={(event) =>
                        setCategories((current) =>
                          current.map((item) =>
                            item.id === category.id ? { ...item, imageUrl: event.target.value } : item,
                          ),
                        )
                      }
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none md:col-span-2"
                    />
                    <textarea
                      value={category.description}
                      onChange={(event) =>
                        setCategories((current) =>
                          current.map((item) =>
                            item.id === category.id ? { ...item, description: event.target.value } : item,
                          ),
                        )
                      }
                      className="min-h-20 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none md:col-span-2"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-text-primary">
                      <span className="text-xs uppercase tracking-[0.2em] text-text-muted">Sort</span>
                      <input
                        type="number"
                        value={category.sortOrder}
                        onChange={(event) =>
                          setCategories((current) =>
                            current.map((item) =>
                              item.id === category.id ? { ...item, sortOrder: Number(event.target.value) } : item,
                            ),
                          )
                        }
                        className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm outline-none"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-text-primary">
                      <input
                        type="checkbox"
                        checked={category.isActive}
                        onChange={(event) =>
                          setCategories((current) =>
                            current.map((item) =>
                              item.id === category.id ? { ...item, isActive: event.target.checked } : item,
                            ),
                          )
                        }
                      />
                      Active
                    </label>

                    <button
                      type="button"
                      onClick={() => void updateCategory(category)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-text-primary disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteCategory(category.id)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-md border border-danger/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-danger disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </main>

        <BottomNavBar activeHref="/admin/content/categories" />
      </div>
    </div>
  );
}
