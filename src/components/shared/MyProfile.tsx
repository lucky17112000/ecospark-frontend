"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AtSign,
  CheckCircle2,
  Clock,
  Leaf,
  ShieldCheck,
  Sprout,
  Star,
  XCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileData = {
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean | null;
  image?: string | null;
  role?: string | null;
  status?: string | null;
  updatedAt?: string | Date | null;
  createdAt?: string | Date | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateTime = (value: ProfileData["createdAt"]) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const renderText = (value?: string | null) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length > 0 ? trimmed : "—";
};

const getAvatarFallbackChar = (name?: string | null, email?: string | null) => {
  const candidate = (name ?? "").trim() || (email ?? "").trim();
  if (!candidate) return "?";
  return candidate.slice(0, 1).toUpperCase();
};

const getRoleStyle = (role: string) => {
  switch (role.toUpperCase()) {
    case "SUPER_ADMIN":
      return "bg-amber-50 text-amber-700 ring-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/40";
    case "ADMIN":
      return "bg-violet-50 text-violet-700 ring-violet-200/70 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-800/40";
    default:
      return "bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800/40";
  }
};

const getStatusStyle = (status: string) => {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800/40";
    case "BLOCKED":
    case "SUSPENDED":
      return "bg-red-50 text-red-700 ring-red-200/70 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-800/40";
    default:
      return "bg-muted text-muted-foreground ring-border";
  }
};

// ─── InfoRow ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  children,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  delay?: string;
}) {
  return (
    <div
      className={cn(
        "group flex items-start gap-3.5 rounded-2xl border bg-card/60 p-4",
        "transition-all duration-300 hover:border-emerald-200/80 hover:bg-card hover:shadow-sm",
        "dark:hover:border-emerald-800/50",
        "animate-eco-fade-up",
        delay,
      )}
    >
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-950/40 dark:group-hover:bg-emerald-900/50">
        <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <div className="text-sm font-medium text-foreground">{children}</div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const MyProfile = ({ data }: { data: ProfileData }) => {
  const emailVerified = data?.emailVerified;
  const status = renderText(data?.status);
  const role = renderText(data?.role);
  const avatarFallback = getAvatarFallbackChar(data?.name, data?.email);
  const imageUrl = typeof data?.image === "string" ? data.image.trim() : "";
  const isActive = status.toUpperCase() === "ACTIVE";

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <div className="animate-eco-fade-up overflow-hidden rounded-3xl border bg-card shadow-xl shadow-black/5 dark:shadow-black/20">
        {/* ── COVER BANNER ─────────────────────────────────────────────── */}
        <div className="relative h-36 overflow-hidden bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-700 sm:h-44">
          {/* Organic blur orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/15 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-6 left-1/3 size-32 rounded-full bg-teal-400/25 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-6 top-4 size-24 rounded-full bg-emerald-300/20 blur-xl"
          />

          {/* Dot-grid texture */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "22px 22px",
            }}
          />

          {/* Top-right shimmer line */}
          <div
            aria-hidden
            className="absolute right-0 top-0 h-px w-2/3 bg-linear-to-l from-white/40 to-transparent"
          />

          {/* EcoSpark chip */}
          <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-sm">
            <Sprout className="size-3.5 text-white" />
            <span className="text-[11px] font-bold tracking-wide text-white">
              EcoSpark
            </span>
          </div>

          {/* Bottom-left decorative leaf lines */}
          <div
            aria-hidden
            className="absolute bottom-4 left-5 flex items-end gap-1.5 opacity-20"
          >
            {[12, 18, 14, 20, 10].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-white"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>

        {/* ── AVATAR + IDENTITY ────────────────────────────────────────── */}
        <div className="flex flex-col items-center px-6 pb-8 pt-0">
          {/* Avatar — overlaps cover */}
          <div className="-mt-14 mb-5 animate-eco-fade-in animate-delay-200">
            <div className="relative">
              {/* Animated glow ring */}
              <div className="absolute -inset-1 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 opacity-70 blur-md animate-eco-float" />
              {/* White ring spacer */}
              <div className="relative size-28 overflow-hidden rounded-full ring-4 ring-card sm:size-32">
                <Avatar className="size-full rounded-full">
                  {imageUrl ? (
                    <AvatarImage
                      src={imageUrl}
                      alt={data?.name ?? "Profile"}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="flex size-full items-center justify-center rounded-full bg-linear-to-br from-emerald-100 to-teal-100 text-3xl font-black text-emerald-700 dark:from-emerald-900/60 dark:to-teal-900/60 dark:text-emerald-300">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Online / active dot */}
              {isActive && (
                <span className="absolute bottom-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-card">
                  <span className="size-2 rounded-full bg-white" />
                </span>
              )}
            </div>
          </div>

          {/* Name */}
          <h1 className="animate-eco-fade-up animate-delay-300 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {renderText(data?.name)}
          </h1>

          {/* Email */}
          <p className="animate-eco-fade-up animate-delay-400 mt-1 text-sm text-muted-foreground">
            {renderText(data?.email)}
          </p>

          {/* Badge row */}
          <div className="animate-eco-fade-up animate-delay-500 mt-4 flex flex-wrap items-center justify-center gap-2">
            {role !== "—" && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                  getRoleStyle(role),
                )}
              >
                <ShieldCheck className="size-3" />
                {role}
              </span>
            )}
            {status !== "—" && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                  getStatusStyle(status),
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500",
                  )}
                />
                {status}
              </span>
            )}
            {emailVerified === true && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200/70 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-800/40">
                <CheckCircle2 className="size-3" />
                Email Verified
              </span>
            )}
          </div>
        </div>

        <Separator className="opacity-60" />

        {/* ── ACCOUNT DETAILS ──────────────────────────────────────────── */}
        <div className="p-6">
          {/* Section heading */}
          <div className="mb-5 flex items-center gap-2 animate-eco-fade-up animate-delay-300">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
              <Leaf className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              Account Details
            </h2>
          </div>

          {/* Info grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow
              icon={AtSign}
              label="Email Address"
              delay="animate-delay-100"
            >
              <span className="break-all">{renderText(data?.email)}</span>
            </InfoRow>

            <InfoRow icon={ShieldCheck} label="Role" delay="animate-delay-200">
              {role !== "—" ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
                    getRoleStyle(role),
                  )}
                >
                  {role}
                </span>
              ) : (
                "—"
              )}
            </InfoRow>

            <InfoRow
              icon={emailVerified ? CheckCircle2 : XCircle}
              label="Email Verified"
              delay="animate-delay-300"
            >
              {emailVerified === true ? (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  Verified
                </span>
              ) : emailVerified === false ? (
                <span className="flex items-center gap-1.5 text-destructive">
                  <XCircle className="size-3.5" />
                  Not verified
                </span>
              ) : (
                "—"
              )}
            </InfoRow>

            <InfoRow
              icon={Zap}
              label="Account Status"
              delay="animate-delay-400"
            >
              {status !== "—" ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
                    getStatusStyle(status),
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isActive ? "bg-emerald-500" : "bg-red-500",
                    )}
                  />
                  {status}
                </span>
              ) : (
                "—"
              )}
            </InfoRow>

            <InfoRow icon={Star} label="Member Since" delay="animate-delay-500">
              <span className="tabular-nums">
                {formatDateTime(data?.createdAt)}
              </span>
            </InfoRow>

            <InfoRow
              icon={Clock}
              label="Last Updated"
              delay="animate-delay-600"
            >
              <span className="tabular-nums">
                {formatDateTime(data?.updatedAt)}
              </span>
            </InfoRow>
          </div>
        </div>

        {/* ── FOOTER STRIP ─────────────────────────────────────────────── */}
        <div className="border-t bg-muted/30 px-6 py-3.5">
          <div className="flex items-center justify-center gap-1.5">
            <Sprout className="size-3.5 text-emerald-500" />
            <span className="text-[11px] font-semibold text-muted-foreground">
              EcoSpark Community Member
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
