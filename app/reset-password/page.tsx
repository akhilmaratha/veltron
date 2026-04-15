"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ResetPasswordFormValues, resetPasswordSchema } from "@/lib/validators/auth";

interface ResetPasswordResponse {
  message: string;
}

export default function ResetPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") ?? "";
    if (token) {
      setValue("token", token);
    }
  }, [setValue]);

  const resetMutation = useMutation({
    mutationFn: async (values: ResetPasswordFormValues) => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as ResetPasswordResponse;
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to reset password.");
      }

      return payload;
    },
    onSuccess: (payload) => {
      setMessage(payload.message);
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "Unable to reset password.");
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    setMessage(null);
    resetMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 sm:p-8">
        <h1 className="font-heading text-3xl text-text-primary">Reset Password</h1>
        <p className="mt-2 text-sm text-text-muted">Enter your reset token and choose a new password.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="token" className="mb-2 block text-xs uppercase tracking-[0.2em] text-text-muted">
              Reset Token
            </label>
            <input
              id="token"
              type="text"
              {...register("token")}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            {errors.token ? <p className="mt-2 text-sm text-danger">{errors.token.message}</p> : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-[0.2em] text-text-muted">
              New Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            {errors.password ? <p className="mt-2 text-sm text-danger">{errors.password.message}</p> : null}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-xs uppercase tracking-[0.2em] text-text-muted">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            {errors.confirmPassword ? <p className="mt-2 text-sm text-danger">{errors.confirmPassword.message}</p> : null}
          </div>

          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-background transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resetMutation.isPending ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-text-muted">{message}</p> : null}

        <p className="mt-6 text-sm text-text-muted">
          Back to <Link href="/login" className="text-primary">sign in</Link>
        </p>
      </div>
    </div>
  );
}
