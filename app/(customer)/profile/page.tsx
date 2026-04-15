"use client";

import Image from "next/image";
import BottomNavBar from "@/components/bottom-nav-bar";
import Footer from "@/components/footer";
import FormField from "@/components/commerce/form-field";
import ProfileAcquisitionRow from "@/components/commerce/profile-acquisition-row";
import TopAppBar from "@/components/top-app-bar";
import { profilePurchases } from "@/lib/commerce-data";

export default function UserProfilePage() {
  const name = "Julian Thorne";
  const email = "j.thorne@veltron.co";
  const bio =
    "Focusing on the intersection of precision engineering and thoughtful domestic objects.";

  return (
    <>
      <TopAppBar activeHref="/user-profile" />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Personal journal</p>
            <h1 className="mt-4 font-heading text-5xl text-text-primary">Your Profile</h1>
            <p className="mt-4 max-w-xl text-lg italic text-text-muted">
              Member since Autumn 2022. Curating premium electronics and refined domestic essentials.
            </p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <div className="relative h-36 w-36 overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
                alt="Profile portrait"
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-lg border border-border bg-background p-6 sm:p-8 shadow-sm">
            <h2 className="font-heading text-3xl text-text-primary">Profile Details</h2>
            <form className="mt-8 space-y-6">
              <FormField id="displayName" label="Display Name" value={name} />
              <FormField id="emailAddress" label="Email Address" type="email" value={email} />
              <FormField id="biography" label="Biography" type="textarea" rows={5} value={bio} />
              <button type="button" className="rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-primary/90">
                Update Profile
              </button>
            </form>
          </section>

          <section className="space-y-8">
            <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
              <h2 className="font-heading text-3xl text-text-primary">Security</h2>
              <p className="mt-4 max-w-md text-text-muted">Two-factor authentication is active via the authenticator app.</p>
              <button type="button" className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Change Password
              </button>
            </div>

            <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
              <h2 className="font-heading text-3xl text-text-primary">Recent Acquisitions</h2>
              <ul className="mt-6">
                {profilePurchases.map((purchase) => (
                  <ProfileAcquisitionRow key={purchase.id} purchase={purchase} />
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <BottomNavBar activeHref="/user-profile" />
    </>
  );
}