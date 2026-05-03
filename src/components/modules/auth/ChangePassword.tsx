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
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Password strength ────────────────────────────────────────────────────────

type StrengthScore = 0 | 1 | 2 | 3 | 4;

const getStrength = (
  pwd: string,
): { score: StrengthScore; label: string; color: string; bar: string } => {
  if (!pwd) return { score: 0, label: "", color: "", bar: "" };
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  const score = Math.min(4, s) as StrengthScore;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "",
    "text-red-500",
    "text-amber-500",
    "text-sky-500",
    "text-emerald-500",
  ];
  const bars = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-sky-400",
    "bg-emerald-500",
  ];
  return {
    score,
    label: labels[score],
    color: colors[score],
    bar: bars[score],
  };
};

// ─── Toggle button ────────────────────────────────────────────────────────────

function EyeToggle({
  show,
  onToggle,
  label,
}: {
  show: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <Button
      type="button"
      onClick={onToggle}
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
      aria-label={label}
    >
      {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </Button>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
      {/* Background blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 size-150 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/20" />
        <div className="absolute -bottom-40 -right-40 size-125 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/15" />
      </div>

      <div className="animate-eco-fade-up w-full max-w-md overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/30">
        {/* Green cover */}
        <div className="relative flex h-28 items-center justify-center overflow-hidden bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-700">
          <div
            aria-hidden
            className="absolute -right-6 -top-6 size-28 rounded-full bg-white/10 blur-xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-4 left-10 size-20 rounded-full bg-teal-400/20 blur-lg"
          />
          <div className="relative flex size-14 items-center justify-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur-sm">
            <ShieldCheck className="size-7 text-white" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200/60 dark:bg-emerald-800/30 animation-duration-[1.5s]" />
            <div className="relative flex size-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
              <CheckCircle2 className="size-7 text-emerald-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              Password updated!
            </h2>
            <p className="text-sm text-muted-foreground">
              Your password has been changed successfully. You&apos;re all set.
            </p>
          </div>

          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-3.5 py-1.5 dark:border-emerald-800/50 dark:bg-emerald-950/40">
            <Sprout className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-bold tracking-wide text-emerald-700 dark:text-emerald-400">
              EcoSpark
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const ChangePassword = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (await mutateAsync(value)) as any;
        if (!result.success) {
          setServerError(
            result.message || "Change password failed. Please try again.",
          );
        } else {
          setSuccess(true);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Change password error:", error);
        setServerError(
          error.message || "An unexpected error occurred. Please try again.",
        );
      }
    },
  });

  if (success) return <SuccessScreen />;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-10 sm:px-6">
      {/* ── Page background ─────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-48 -top-48 size-175 rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-900/15" />
        <div className="absolute -bottom-48 -right-48 size-150 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/15" />
        <div className="absolute left-1/2 top-1/2 size-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/20 blur-3xl dark:bg-emerald-950/20" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #10b981 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Card ────────────────────────────────────────────────────────── */}
      <div className="animate-eco-fade-up w-full max-w-115 overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-emerald-900/8 dark:shadow-emerald-900/25">
        {/* ── Cover banner ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-700 px-8 py-8">
          {/* Orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-4 left-1/4 size-28 rounded-full bg-teal-400/20 blur-xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-4 top-2 size-20 rounded-full bg-emerald-300/15 blur-lg"
          />

          {/* Dot texture */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Top shimmer line */}
          <div
            aria-hidden
            className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-white/40 to-transparent"
          />

          {/* EcoSpark badge */}
          <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 backdrop-blur-sm">
            <Sprout className="size-3 text-white" />
            <span className="text-[10px] font-bold tracking-widest text-white uppercase">
              EcoSpark
            </span>
          </div>

          {/* Lock icon */}
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-white/25 bg-white/15 shadow-lg backdrop-blur-sm">
              <Lock className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Change Password
              </h1>
              <p className="mt-1 text-sm text-emerald-100/80">
                Update your credentials to keep your account secure.
              </p>
            </div>
          </div>

          {/* Decorative mini bars */}
          <div
            aria-hidden
            className="absolute bottom-4 right-6 flex items-end gap-1 opacity-25"
          >
            {[8, 14, 10, 18, 12].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-white"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>

        {/* ── Form body ────────────────────────────────────────────────── */}
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
            className="space-y-5"
          >
            {/* Current password */}
            <div className="animate-eco-fade-up animate-delay-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <KeyRound className="size-3.5" />
                Current Password
              </div>
              <form.Field
                name="currentPassword"
                validators={{ onChange: loginZodSchema.shape.password }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label=""
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    append={
                      <EyeToggle
                        show={showCurrentPassword}
                        onToggle={() => setShowCurrentPassword((p) => !p)}
                        label={
                          showCurrentPassword
                            ? "Hide current password"
                            : "Show current password"
                        }
                      />
                    }
                  />
                )}
              </form.Field>
            </div>

            {/* New password + strength meter */}
            <div className="animate-eco-fade-up animate-delay-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <ShieldCheck className="size-3.5" />
                New Password
              </div>
              <form.Field
                name="newPassword"
                validators={{ onChange: loginZodSchema.shape.password }}
              >
                {(field) => {
                  const strength = getStrength(field.state.value ?? "");
                  return (
                    <div className="space-y-3">
                      <AppField
                        field={field}
                        label=""
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Create a strong new password"
                        append={
                          <EyeToggle
                            show={showNewPassword}
                            onToggle={() => setShowNewPassword((p) => !p)}
                            label={
                              showNewPassword
                                ? "Hide new password"
                                : "Show new password"
                            }
                          />
                        }
                      />

                      {/* Strength meter */}
                      {field.state.value && (
                        <div className="space-y-1.5 animate-eco-fade-in">
                          <div className="flex gap-1.5">
                            {([1, 2, 3, 4] as const).map((seg) => (
                              <div
                                key={seg}
                                className={cn(
                                  "h-1.5 flex-1 rounded-full transition-all duration-500",
                                  seg <= strength.score
                                    ? strength.bar
                                    : "bg-muted",
                                )}
                              />
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                "text-xs font-semibold",
                                strength.color,
                              )}
                            >
                              {strength.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {strength.score === 4
                                ? "Great password!"
                                : "Add numbers & symbols to strengthen"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            {/* Server error */}
            {serverError && (
              <Alert className="animate-eco-fade-in rounded-2xl border-red-100 bg-red-50/80 py-3 dark:border-red-900/30 dark:bg-red-950/20">
                <AlertTriangle className="size-4 text-red-500" />
                <AlertDescription className="text-sm text-red-600 dark:text-red-400">
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
                  pendingLabel="Updating password…"
                  classname={cn(
                    "animate-eco-fade-up animate-delay-300",
                    "w-full h-11 rounded-2xl",
                    "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800",
                    "text-white text-sm font-semibold tracking-wide",
                    "shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                  )}
                >
                  <Lock className="mr-2 size-4" />
                  Update Password
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </div>

        {/* ── Footer strip ─────────────────────────────────────────────── */}
        <div className="border-t bg-muted/30 px-6 py-3.5">
          <div className="flex items-center justify-center gap-1.5">
            <Sprout className="size-3.5 text-emerald-500" />
            <span className="text-[11px] font-semibold text-muted-foreground">
              EcoSpark · Secure Account Management
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
