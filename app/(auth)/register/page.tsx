"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { SignupFormValues, signupSchema } from "@/lib/validators/auth";

export default function SignupPage() {
  const router = useRouter();
  const callbackUrl =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("callbackUrl") ?? "/" : "/";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (values: SignupFormValues) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to create account right now.");
      }

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        throw new Error("Account created but sign in failed. Please sign in manually.");
      }

      return result;
    },
    onSuccess: (result) => {
      setSuccessMessage("Account created successfully.");
      router.push(result.url ?? callbackUrl);
      router.refresh();
    },
    onError: (error) => {
      setSuccessMessage(null);
      setErrorMessage(error instanceof Error ? error.message : "Unable to create account right now.");
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    signupMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-background font-body text-text-primary">
      <header className="flex w-full items-center justify-between px-6 py-8">
        <div className="flex-1">
          <Link
            href="/"
            className="inline-flex rounded-md p-1 text-primary transition hover:opacity-80"
            aria-label="Close signup"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
        <h1 className="flex-1 text-center font-heading text-xl uppercase tracking-[0.08em] text-text-primary">
          THE CURATOR
        </h1>
        <div className="flex-1" />
      </header>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-24">
          <div className="relative hidden h-175 overflow-hidden rounded-sm md:block">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWcaRjwOMN_nrh3Bd6eum96eg4ZOi45i98bJGgFfnLDn1p6gZ__RTlFdVt-BxA9ENfJIHhcNKYuqPPaE2xPeXfNQBSDIbbaFUhU7-SqoXn2J-C6NcQr35O1DwUgCqGDsEHZKW1H4uUQ3M8MwNG12Qfwr-zaGojGKiF-iC8yYTXgQmlVimmn9CXii1DbVl7fUc2q83RLf8Q2jdHASpT79iFyXXdKpQBWJGAgTHyMxB3oJBqSQd8kfqHEGGj5ihyvU7GLkOFZluctjjp"
              alt="Architectural interior with warm shadows"
              fill
              sizes="(max-width: 1024px) 0vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
            <div className="absolute bottom-12 left-12 right-12">
              <p className="font-heading text-3xl italic leading-tight text-background">
                &quot;Design is not just what it looks like and feels like. Design is how it works.&quot;
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-background/80">
                Issue No. 04 - The Archive
              </p>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-col md:mx-0">
            <div className="mb-12">
              <h2 className="font-heading text-5xl tracking-tight text-text-primary">Join the Archive</h2>
              <p className="mt-4 max-w-xs leading-relaxed text-text-muted">
                Enter a world of curated aesthetics and permanent collections.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="name" className="ml-1 block text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  Full Name
                </label>
                <input
                  id="name"
                  placeholder="Julianne Moore"
                  {...register("name")}
                  className="w-full rounded-lg border border-border bg-background px-4 py-4 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-primary focus:outline-none"
                />
                {errors.name ? (
                  <p className="text-sm text-danger">{errors.name.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="ml-1 block text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="archive@thecurator.com"
                  {...register("email")}
                  className="w-full rounded-lg border border-border bg-background px-4 py-4 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-primary focus:outline-none"
                />
                {errors.email ? (
                  <p className="text-sm text-danger">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="ml-1 block text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full rounded-lg border border-border bg-background px-4 py-4 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-primary focus:outline-none"
                />
                {errors.password ? (
                  <p className="text-sm text-danger">{errors.password.message}</p>
                ) : null}
              </div>

              {errorMessage ? (
                <p className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                  {errorMessage}
                </p>
              ) : null}
              {successMessage ? (
                <p className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                  {successMessage}
                </p>
              ) : null}

              <div className="flex flex-col gap-4 pt-4">
                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full rounded-md bg-primary px-8 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                </button>

                <div className="relative flex items-center py-4">
                  <div className="grow border-t border-border" />
                  <span className="mx-4 shrink-0 text-[10px] uppercase tracking-[0.2em] text-text-muted">
                    or continue with
                  </span>
                  <div className="grow border-t border-border" />
                </div>

                <button
                  type="button"
                  onClick={() => void signIn("google", { callbackUrl })}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-background px-8 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-text-primary transition hover:bg-surface"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="currentColor"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign up with Google
                </button>
              </div>

              <div className="mt-12 text-center">
                <p className="text-sm text-text-muted">
                  Already a member?
                  <Link
                    href="/login"
                    className="ml-1 font-medium text-primary underline-offset-4 transition hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>

            <footer className="mt-24 flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-border pt-8 pb-8 md:justify-start">
              <Link href="#" className="text-[9px] uppercase tracking-[0.2em] text-text-muted transition hover:text-primary">
                Privacy
              </Link>
              <Link href="#" className="text-[9px] uppercase tracking-[0.2em] text-text-muted transition hover:text-primary">
                Terms
              </Link>
              <Link href="#" className="text-[9px] uppercase tracking-[0.2em] text-text-muted transition hover:text-primary">
                Support
              </Link>
              <span className="text-[9px] uppercase tracking-[0.2em] text-text-muted/50">© 2024 THE CURATOR</span>
            </footer>
          </div>
        </div>
      </main>

      <div className="h-16 md:hidden" />
    </div>
  );
}