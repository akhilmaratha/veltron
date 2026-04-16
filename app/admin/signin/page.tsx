"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";

export default function AdminSignInPage() {
  const router = useRouter();
  const callbackUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("callbackUrl") ?? "/admin"
      : "/admin";

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
        loginMode: "admin",
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        throw new Error("Admin credentials are invalid or account is not an admin.");
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 font-body text-text-primary">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8 shadow-sm sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Veltron admin</p>
            <h1 className="font-heading text-3xl">Admin Sign In</h1>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@veltron.com"
              {...register("email")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary"
            />
            {errors.email ? <p className="text-sm text-danger">{errors.email.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary"
            />
            {errors.password ? <p className="text-sm text-danger">{errors.password.message}</p> : null}
          </div>

          {errorMessage ? (
            <p className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In as Admin"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-text-muted">
          <Link href="/login" className="transition hover:text-primary">
            User sign in
          </Link>
          <Link href="/" className="transition hover:text-primary">
            Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}
