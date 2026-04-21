"use client";
import AppField from "@/components/shared/Appfield";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  changePasswordAction,
  ChangePasswordPayload,
} from "@/services/auth.service";
import { loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const ChangePassword = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { mutateAsync } = useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      changePasswordAction(payload),
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;
        if (!result.success) {
          setServerError(
            result.message || "Change password failed. Please try again.",
          );
        }
      } catch (error: any) {
        console.error("Change password error:", error);
        setServerError(
          error.message || "An unexpected error occurred. Please try again.",
        );
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
              <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
              <path d="M12 1v2" />
              <path d="M12 21v2" />
              <path d="M4.22 4.22l1.42 1.42" />
              <path d="M18.36 18.36l1.42 1.42" />
              <path d="M1 12h2" />
              <path d="M21 12h2" />
              <path d="M4.22 19.78l1.42-1.42" />
              <path d="M18.36 5.64l1.42-1.42" />
            </svg>
          </div>

          <h1 className="text-xl font-semibold text-black tracking-tight">
            Change password
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Enter your current password and set a new one.
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
              name="currentPassword"
              validators={{ onChange: loginZodSchema.shape.password }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Current password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:text-black transition-colors"
                      aria-label={
                        showCurrentPassword
                          ? "Hide current password"
                          : "Show current password"
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            <form.Field
              name="newPassword"
              validators={{ onChange: loginZodSchema.shape.password }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="New password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neutral-400 hover:text-black transition-colors"
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {serverError && (
              <Alert className="border border-neutral-200 bg-neutral-50 rounded-xl py-3 px-4">
                <AlertDescription className="text-sm text-red-600">
                  {serverError}
                </AlertDescription>
              </Alert>
            )}

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
                  Change Password
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
