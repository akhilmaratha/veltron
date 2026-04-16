"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Save, Trash2 } from "lucide-react";
import NavigationDrawer from "@/components/navigation-drawer";
import TopAppBar from "@/components/top-app-bar";
import BottomNavBar from "@/components/bottom-nav-bar";

interface HeroSlideRow {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

const emptyForm = {
  eyebrow: "",
  title: "",
  description: "",
  ctaLabel: "",
  ctaUrl: "/products",
  imageUrl: "",
  sortOrder: "0",
  isActive: true,
  startsAt: "",
  endsAt: "",
};

export default function AdminHomepageContentPage() {
  const [slides, setSlides] = useState<HeroSlideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/hero-slides", { cache: "no-store" });
      const payload = (await response.json()) as { items?: HeroSlideRow[]; message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to load hero slides.");
      }

      setSlides(payload.items ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load hero slides.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSlides();
  }, []);

  const createSlide = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eyebrow: form.eyebrow,
          title: form.title,
          description: form.description,
          ctaLabel: form.ctaLabel,
          ctaUrl: form.ctaUrl,
          imageUrl: form.imageUrl,
          sortOrder: Number(form.sortOrder),
          isActive: form.isActive,
          startsAt: form.startsAt,
          endsAt: form.endsAt,
        }),
      });

      const payload = (await response.json()) as HeroSlideRow & { message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to create slide.");
      }

      setSlides((current) => [...current, payload].sort((a, b) => a.sortOrder - b.sortOrder));
      setForm(emptyForm);
      setMessage("Hero slide created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create slide.");
    } finally {
      setSaving(false);
    }
  };

  const updateSlide = async (slide: HeroSlideRow) => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch(`/api/admin/hero-slides/${slide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slide),
      });

      const payload = (await response.json()) as HeroSlideRow & { message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to update slide.");
      }

      setSlides((current) =>
        current
          .map((item) => (item.id === slide.id ? payload : item))
          .sort((a, b) => a.sortOrder - b.sortOrder),
      );
      setMessage("Hero slide updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update slide.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSlide = async (slideId: string) => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch(`/api/admin/hero-slides/${slideId}`, { method: "DELETE" });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to delete slide.");
      }

      setSlides((current) => current.filter((item) => item.id !== slideId));
      setMessage("Hero slide deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete slide.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationDrawer activeHref="/admin/content/homepage" />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopAppBar activeHref="/admin/content/homepage" showNavigation={false} title="Veltron" />

        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Content management</p>
                <h1 className="mt-4 font-heading text-4xl text-text-primary sm:text-5xl">Homepage Hero Slides</h1>
              </div>
              <Link href="/admin/settings" className="text-xs uppercase tracking-[0.22em] text-primary">
                Back to settings
              </Link>
            </section>

            {message ? (
              <p className="mb-6 rounded-md border border-border bg-surface px-4 py-3 text-sm text-text-primary">{message}</p>
            ) : null}

            <section className="rounded-lg border border-border bg-background p-6 shadow-sm">
              <h2 className="font-heading text-2xl text-text-primary">Add New Slide</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  value={form.eyebrow}
                  onChange={(event) => setForm((current) => ({ ...current, eyebrow: event.target.value }))}
                  placeholder="Eyebrow"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
                />
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Title"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
                />
                <input
                  value={form.ctaLabel}
                  onChange={(event) => setForm((current) => ({ ...current, ctaLabel: event.target.value }))}
                  placeholder="CTA Label"
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm outline-none"
                />
                <input
                  value={form.ctaUrl}
                  onChange={(event) => setForm((current) => ({ ...current, ctaUrl: event.target.value }))}
                  placeholder="CTA URL"
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
                onClick={() => void createSlide()}
                disabled={saving}
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                Create slide
              </button>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="font-heading text-3xl text-text-primary">Existing Slides</h2>
              {loading ? <p className="text-sm text-text-muted">Loading slides...</p> : null}

              {!loading && slides.length === 0 ? (
                <p className="rounded-lg border border-border bg-surface p-5 text-sm text-text-muted">No hero slides yet.</p>
              ) : null}

              {slides.map((slide) => (
                <article key={slide.id} className="rounded-lg border border-border bg-background p-5 shadow-sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={slide.eyebrow}
                      onChange={(event) =>
                        setSlides((current) =>
                          current.map((item) =>
                            item.id === slide.id ? { ...item, eyebrow: event.target.value } : item,
                          ),
                        )
                      }
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                    />
                    <input
                      value={slide.title}
                      onChange={(event) =>
                        setSlides((current) =>
                          current.map((item) =>
                            item.id === slide.id ? { ...item, title: event.target.value } : item,
                          ),
                        )
                      }
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                    />
                    <textarea
                      value={slide.description}
                      onChange={(event) =>
                        setSlides((current) =>
                          current.map((item) =>
                            item.id === slide.id ? { ...item, description: event.target.value } : item,
                          ),
                        )
                      }
                      className="min-h-20 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none md:col-span-2"
                    />
                    <input
                      value={slide.ctaLabel}
                      onChange={(event) =>
                        setSlides((current) =>
                          current.map((item) =>
                            item.id === slide.id ? { ...item, ctaLabel: event.target.value } : item,
                          ),
                        )
                      }
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                    />
                    <input
                      value={slide.ctaUrl}
                      onChange={(event) =>
                        setSlides((current) =>
                          current.map((item) =>
                            item.id === slide.id ? { ...item, ctaUrl: event.target.value } : item,
                          ),
                        )
                      }
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
                    />
                    <input
                      value={slide.imageUrl}
                      onChange={(event) =>
                        setSlides((current) =>
                          current.map((item) =>
                            item.id === slide.id ? { ...item, imageUrl: event.target.value } : item,
                          ),
                        )
                      }
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none md:col-span-2"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-text-primary">
                      <span className="text-xs uppercase tracking-[0.2em] text-text-muted">Sort</span>
                      <input
                        type="number"
                        value={slide.sortOrder}
                        onChange={(event) =>
                          setSlides((current) =>
                            current.map((item) =>
                              item.id === slide.id ? { ...item, sortOrder: Number(event.target.value) } : item,
                            ),
                          )
                        }
                        className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm outline-none"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-text-primary">
                      <input
                        type="checkbox"
                        checked={slide.isActive}
                        onChange={(event) =>
                          setSlides((current) =>
                            current.map((item) =>
                              item.id === slide.id ? { ...item, isActive: event.target.checked } : item,
                            ),
                          )
                        }
                      />
                      Active
                    </label>

                    <button
                      type="button"
                      onClick={() => void updateSlide(slide)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-text-primary disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteSlide(slide.id)}
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

        <BottomNavBar activeHref="/admin/content/homepage" />
      </div>
    </div>
  );
}
