"use client";
import AppField from "@/components/shared/Appfield";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  forgotPasswordAction,
  ForgotPasswordPayload,
} from "@/services/auth.service";
import type { ApiResponse } from "@/types/api.types";
import { loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
};

const ForgotPasswordC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { mutateAsync } = useMutation<
    ApiResponse<unknown>,
    unknown,
    ForgotPasswordPayload
  >({
    mutationFn: (payload) => forgotPasswordAction(payload),
  });
  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);
      try {
        const result = await mutateAsync(value);
        if (!result?.success) {
          setServerError(
            result?.message ||
              "Forgot password request failed. Please try again.",
          );
          return;
        }

        setSuccessMessage(
          result?.message ||
            "If an account exists for that email, a reset link has been sent.",
        );
      } catch (error: unknown) {
        console.error("Forgot password request error:", error);
        setServerError(getErrorMessage(error));
      }
    },
  });
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 px-4 py-10 sm:px-6">
      <div className="w-full max-w-[460px] bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 pt-8 pb-6 sm:px-8 border-b border-neutral-100">
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
              <path d="M4 4h16v16H4V4Z" />
              <path d="m22 6-10 7L2 6" />
            </svg>
          </div>

          <h1 className="text-xl font-semibold text-black tracking-tight">
            Forgot password
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Enter your email and we’ll send a reset link.
          </p>
        </div>

        <div className="px-6 py-7 sm:px-8 sm:py-8">
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
              name="email"
              validators={{ onChange: loginZodSchema.shape.email }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  disabled={form.state.isSubmitting}
                />
              )}
            </form.Field>

            {(serverError || successMessage) && (
              <Alert
                className={cn(
                  "border border-neutral-200 bg-neutral-50 rounded-xl py-3 px-4",
                )}
              >
                <AlertDescription
                  className={cn(
                    "text-sm",
                    serverError ? "text-red-600" : "text-green-700",
                  )}
                >
                  {serverError || successMessage}
                </AlertDescription>
              </Alert>
            )}

            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting}
                  pendingLabel="Sending..."
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
                  Send reset link
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordC;
