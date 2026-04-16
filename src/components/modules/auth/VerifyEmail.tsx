"use client";

import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyEmailAction } from "@/services/auth.service";
import type { IVerifyEmailPayload } from "@/zod/auth.validation";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const email = useMemo(() => {
    const value = searchParams.get("email");
    return value ? value.trim() : "";
  }, [searchParams]);

  const [otp, setOtp] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IVerifyEmailPayload) => verifyEmailAction(payload),
  });

  const canSubmit = email.length > 0 && otp.length === 6;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 px-4 py-10 sm:px-6">
      <div className="w-full max-w-[460px] bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 pt-8 pb-6 sm:px-8 border-b border-neutral-100">
          <h1 className="text-xl font-semibold text-black tracking-tight">
            Verify your email
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Enter the 6-digit code we sent to
          </p>
          <p className="mt-3 inline-flex w-full items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-900 break-all">
            {email || "(no email in URL)"}
          </p>
        </div>

        <div className="px-6 py-7 sm:px-8 sm:py-8">
          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!canSubmit) return;

              setServerError(null);
              try {
                const result = await mutateAsync({ email, otp });
                if (!result.success) {
                  setServerError(result.message || "Verification failed");
                  return;
                }

                router.push("/dashboard");
              } catch (error: any) {
                console.error("Verification error:", error);
                setServerError(
                  error?.message ||
                    "An unexpected error occurred. Please try again.",
                );
              }
            }}
          >
            <div className="space-y-2">
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>

              <InputOTP
                id="otp"
                maxLength={6}
                value={otp}
                onChange={setOtp}
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-invalid={Boolean(serverError)}
                containerClassName="w-full justify-center"
              >
                <InputOTPGroup className="justify-center">
                  <InputOTPSlot
                    index={0}
                    className="size-11 text-base sm:size-12"
                  />
                  <InputOTPSlot
                    index={1}
                    className="size-11 text-base sm:size-12"
                  />
                  <InputOTPSlot
                    index={2}
                    className="size-11 text-base sm:size-12"
                  />
                  <InputOTPSlot
                    index={3}
                    className="size-11 text-base sm:size-12"
                  />
                  <InputOTPSlot
                    index={4}
                    className="size-11 text-base sm:size-12"
                  />
                  <InputOTPSlot
                    index={5}
                    className="size-11 text-base sm:size-12"
                  />
                </InputOTPGroup>
              </InputOTP>

              <p className="text-xs text-neutral-500">
                Tip: Check your spam folder if you don’t see the email.
              </p>

              {/* payload you can send to backend: { email, otp } */}
            </div>

            {serverError && (
              <Alert className="border border-red-200 bg-red-50 rounded-xl py-3 px-4">
                <AlertDescription className="text-sm text-red-700">
                  {serverError}
                </AlertDescription>
              </Alert>
            )}

            <AppSubmitButton
              isPending={isPending}
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
              Verify
            </AppSubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
