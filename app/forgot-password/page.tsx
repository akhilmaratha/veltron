"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/lib/validators/auth";

interface ForgotPasswordResponse {
  message: string;
  resetUrl?: string;
}

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotMutation = useMutation({
    mutationFn: async (values: ForgotPasswordFormValues) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as ForgotPasswordResponse;
      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to send reset link.");
      }

      return payload;
    },
    onSuccess: (payload) => {
      setMessage(payload.message);
      setResetUrl(payload.resetUrl ?? null);
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "Unable to send reset link.");
      setResetUrl(null);
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    setMessage(null);
    setResetUrl(null);
    forgotMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 sm:p-8">
        <h1 className="font-heading text-3xl text-text-primary">Forgot Password</h1>
        <p className="mt-2 text-sm text-text-muted">
          Enter your account email. We&apos;ll generate a secure reset link.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.2em] text-text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="curator@journal.com"
              {...register("email")}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            {errors.email ? <p className="mt-2 text-sm text-danger">{errors.email.message}</p> : null}
          </div>

          <button
            type="submit"
            disabled={forgotMutation.isPending}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-background transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {forgotMutation.isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-text-muted">{message}</p> : null}

        {resetUrl ? (
          <p className="mt-3 break-all rounded-md border border-border bg-surface p-3 text-xs text-text-muted">
            Dev reset URL: <a href={resetUrl} className="text-primary underline">{resetUrl}</a>
          </p>
        ) : null}

        <p className="mt-6 text-sm text-text-muted">
          Remembered your password? <Link href="/login" className="text-primary">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
