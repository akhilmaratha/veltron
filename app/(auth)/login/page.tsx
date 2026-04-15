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
import { LoginFormValues, loginSchema } from "@/lib/validators/auth";

export default function LoginPage() {
  const router = useRouter();
  const callbackUrl =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("callbackUrl") ?? "/" : "/";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        throw new Error("Invalid email or password.");
      }

      return result;
    },
    onSuccess: (result) => {
      router.push(result.url ?? callbackUrl);
      router.refresh();
    },
    onError: (error) => {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in right now.");
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setErrorMessage(null);
    loginMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-text-primary selection:bg-primary/20">
      <header className="flex w-full items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <Link
            href="/"
            className="inline-flex rounded-md p-1 text-primary transition hover:opacity-80 active:scale-95"
            aria-label="Close sign in"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
        <div className="font-heading text-xl uppercase tracking-[0.08em] text-text-primary">THE CURATOR</div>
        <div className="w-6" />
      </header>

      <main className="flex grow items-center justify-center px-6 py-20">
        <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-24">
          <div className="relative hidden lg:col-span-7 lg:block">
            <div className="aspect-4/5 overflow-hidden rounded-lg bg-surface">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhyA-BpGRBvEamzXcqw0xnRA8z8_pHd3OW0XP3_Q1lOsADRX8Y8lyZne428btwYu1_oQRO8e4RFsyG0HalQs2oSmWJx0lRK6_V3UM0imfND1y1GRziy1ACMn9_sRGgiXxKq5tUJv6x-ijK2XClRumJDbz3uQ103IqIi2LSrSfVN39sulTs2N6vDb742PZf2FQROHy1rGECSUCKyBglUU_-3LeNKtAfvteZxRjv9R2GfDZrd63134t5M0GnOtM_hvQBCE-kvn6oaNoi"
                alt="Minimalist luxury interior"
                fill
                sizes="(max-width: 1024px) 0vw, 60vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 aspect-square overflow-hidden rounded-lg border border-border/30 bg-background p-4 shadow-sm">
              <div className="relative h-full w-full overflow-hidden rounded-md">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBHFSotdfJPg0rBVoT0du8k2ExD2cE2JbScnvDy7Z77eqmIPzIcObt48RWwDWgdauWydY5eMs3agkPI2gNuV_3TfHjvsJvAh21TzakPZOU7bNJ-gQox4AbzpoII4805cbE-dMRhqOEOaOiUTQ7jNGfwgw9MuKZlmD2YzvAVabUVlLAwAmPeTn42eJlPPGxV0z76a1NYvC-Ld4Op7Dlr-sBuNXILsl_x39kBwwTWDPLl33QCa2Ee63t6OYogFlhslKzrLYWNxchFmwm"
                  alt="Curated objects"
                  fill
                  sizes="256px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-5">
            <div className="mb-12">
              <h1 className="font-heading text-5xl tracking-tight text-text-primary lg:text-6xl">Welcome Back</h1>
              <p className="mt-4 text-lg font-light leading-relaxed text-text-muted">
                Please enter your details to access your curated collection.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-[0.75rem] font-medium uppercase tracking-widest text-text-muted">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="curator@journal.com"
                  {...register("email")}
                  className="w-full rounded-lg border border-border/60 bg-background px-4 py-3 text-text-primary outline-none transition-all placeholder:text-text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {errors.email ? (
                  <p className="text-sm text-danger">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-[0.75rem] font-medium uppercase tracking-widest text-text-muted">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[0.7rem] font-medium uppercase tracking-widest text-primary transition-opacity hover:opacity-80"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full rounded-lg border border-border/60 bg-background px-4 py-3 text-text-primary outline-none transition-all placeholder:text-text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary"
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

              <div className="flex flex-col gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full rounded-md bg-primary py-4 font-medium tracking-wide text-background shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                </button>

                <div className="relative flex items-center py-4">
                  <div className="grow border-t border-border/40" />
                  <span className="mx-4 shrink-0 text-[10px] uppercase tracking-[0.2em] text-text-muted/60">or</span>
                  <div className="grow border-t border-border/40" />
                </div>

                <button
                  type="button"
                  onClick={() => void signIn("google", { callbackUrl })}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-border/30 bg-surface px-4 py-4 font-medium tracking-wide text-text-primary transition-all duration-200 hover:bg-surface/70 active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.34-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            </form>

            <div className="mt-12 text-center">
              <p className="font-light text-text-muted">
                Don&apos;t have an account?
                <Link
                  href="/signup"
                  className="ml-1 border-b border-primary/20 font-medium text-primary transition-colors hover:border-primary"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-border/40 bg-background px-12 md:hidden">
        <Link
          href="/login"
          className="flex flex-col items-center justify-center border-t-2 border-primary pt-2 text-primary transition-colors"
        >
          <span className="text-[10px] font-medium uppercase tracking-widest">Sign In</span>
        </Link>
        <Link
          href="/signup"
          className="flex flex-col items-center justify-center pt-2 text-text-muted transition-colors hover:text-primary"
        >
          <span className="text-[10px] font-medium uppercase tracking-widest">Register</span>
        </Link>
      </nav>

      <footer className="hidden px-6 py-12 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-text-muted/60">
          <div className="text-[10px] uppercase tracking-[0.3em]">© 2024 The Curator Journal</div>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em]">
            <Link href="#" className="transition-colors hover:text-text-primary">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-text-primary">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}