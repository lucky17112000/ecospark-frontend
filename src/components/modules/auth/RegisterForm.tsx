"use client";
import AppField from "@/components/shared/Appfield";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { loginAction, registerAction } from "@/services/auth.service";
import {
  ILoginPayload,
  IRegisterPayload,
  loginZodSchema,
  registerZodSchema,
} from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// ─── Google SVG Icon ──────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="shrink-0"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// ─── Brand Logo Mark ──────────────────────────────────────────────────────────
const BrandMark = () => (
  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black mb-5">
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const RegisterForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;
        if (!result.success) {
          setServerError(result.message || "Login failed. Please try again.");
          return;
        }

        router.push(`/verify-email?email=${encodeURIComponent(value.email)}`);
      } catch (error: any) {
        console.error("Login error:", error);
        setServerError(
          error.message || "An unexpected error occurred. Please try again.",
        );
      }
    },
  });

  return (
    // Full-screen centering wrapper — neutral-100 bg on all screen sizes
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-100 px-4 py-10 sm:px-6">
      {/*
        Card:
        - w-full so it fills mobile screens edge-to-edge (minus px-4 padding)
        - max-w-[420px] caps width on tablet/desktop
        - rounded-2xl, white bg, subtle border
      */}
      <div className="w-full max-w-[420px] bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="px-6 pt-8 pb-6 sm:px-8 border-b border-neutral-100">
          <BrandMark />
          <h1 className="text-xl font-semibold text-black tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Sign in to your account to continue.
          </p>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="px-6 py-7 sm:px-8 sm:py-8">
          {/* Google Sign-In */}
          <button
            type="button"
            className="
              w-full flex items-center justify-center gap-2.5
              h-10 px-4
              bg-white border border-neutral-200 rounded-xl
              text-sm text-black font-medium
              hover:bg-neutral-50 active:bg-neutral-100
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black
            "
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400 whitespace-nowrap">
              or sign in with email
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Email + Password form — all original logic preserved */}
          <form
            method="POST"
            action="#"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="name"
              validators={{ onChange: registerZodSchema.shape.name }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Name"
                  type="text"
                  placeholder="Enter your name"
                />
              )}
            </form.Field>
            {/* Email */}
            <form.Field
              name="email"
              validators={{ onChange: registerZodSchema.shape.email }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                />
              )}
            </form.Field>

            {/* Password */}
            <form.Field
              name="password"
              validators={{ onChange: registerZodSchema.shape.password }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:text-black transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {/* Server error */}
            {serverError && (
              <Alert className="border border-neutral-200 bg-neutral-50 rounded-xl py-3 px-4">
                <AlertDescription className="text-sm text-red-600">
                  {serverError}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting}
                  disabled={!canSubmit}
                  classname="
                    w-full h-10
                    bg-black hover:bg-neutral-800 active:bg-neutral-900
                    text-white text-sm font-medium
                    rounded-xl
                    transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  Register
                </AppSubmitButton>
              )}
            </form.Subscribe>

            {/* Sign-up link */}
            <p className="text-center text-sm text-neutral-400 pt-1">
              Don&apos;t have an account?{" "}
              <Link
                href="/login"
                className="text-black font-medium hover:underline underline-offset-4 transition-colors"
              >
                login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
