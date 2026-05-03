"use client";

import { cn } from "@/lib/utils";

// ─── Design tokens ────────────────────────────────────────────────────────────
// Eco-green palette used exclusively in loading states
// Light: oklch(0.72 0.2 145)  Dark: oklch(0.6 0.18 170)

// ─── Base skeleton ────────────────────────────────────────────────────────────

interface EcoSkeletonProps extends React.ComponentProps<"div"> {}

export function EcoSkeleton({ className, ...props }: EcoSkeletonProps) {
  return <div className={cn("eco-skeleton", className)} {...props} />;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

interface EcoSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SPINNER_SIZES = {
  xs: "size-4",
  sm: "size-6",
  md: "size-9",
  lg: "size-14",
  xl: "size-20",
} as const;

const BORDER_SIZES = {
  xs: "border",
  sm: "border-2",
  md: "border-2",
  lg: "border-[3px]",
  xl: "border-4",
} as const;

const DOT_SIZES = {
  xs: "size-1",
  sm: "size-1.5",
  md: "size-2",
  lg: "size-3",
  xl: "size-4",
} as const;

export function EcoSpinner({ size = "md", className }: EcoSpinnerProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        SPINNER_SIZES[size],
        className,
      )}
    >
      {/* Glow ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          BORDER_SIZES[size],
          "border-[oklch(0.72_0.2_145/0.18)]",
        )}
      />
      {/* Spinning arc */}
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          BORDER_SIZES[size],
          "border-transparent border-t-[oklch(0.72_0.2_145)] border-r-[oklch(0.65_0.18_170/0.6)]",
          "animate-[eco-spinner-rotate_0.9s_linear_infinite]",
        )}
      />
      {/* Inner dot */}
      <div
        className={cn(
          "rounded-full bg-[oklch(0.72_0.2_145)]",
          DOT_SIZES[size],
        )}
      />
    </div>
  );
}

// ─── Top-of-page progress bar ─────────────────────────────────────────────────

export function EcoTopBar() {
  return <div className="eco-topbar" />;
}

// ─── Full-screen overlay loader ───────────────────────────────────────────────

interface EcoPageLoaderProps {
  message?: string;
}

export function EcoPageLoader({ message = "Loading EcoSpark…" }: EcoPageLoaderProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/75 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8">
        {/* Concentric pulse rings */}
        <div className="relative flex size-24 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-[oklch(0.72_0.2_145/0.12)] [animation-duration:1.6s]" />
          <span className="absolute inset-3 animate-ping rounded-full bg-[oklch(0.65_0.18_170/0.1)] [animation-duration:1.6s] [animation-delay:200ms]" />
          <span className="absolute inset-6 animate-ping rounded-full bg-[oklch(0.6_0.18_190/0.08)] [animation-duration:1.6s] [animation-delay:400ms]" />
          <EcoSpinner size="xl" />
        </div>

        {/* Brand + message */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-sm font-semibold tracking-[0.18em] uppercase text-[oklch(0.72_0.2_145)] animate-pulse">
            EcoSpark
          </span>
          <p className="text-xs text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Inline loading state (inside buttons, rows, etc.) ────────────────────────

interface EcoInlineLoaderProps {
  label?: string;
  className?: string;
}

export function EcoInlineLoader({ label = "Loading…", className }: EcoInlineLoaderProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <EcoSpinner size="xs" />
      {label}
    </span>
  );
}

// ─── Stat card skeleton ───────────────────────────────────────────────────────

export function EcoStatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border bg-card p-5 space-y-3 overflow-hidden", className)}>
      <div className="flex items-center justify-between">
        <EcoSkeleton className="h-4 w-24" />
        <EcoSkeleton className="size-10 rounded-xl" />
      </div>
      <EcoSkeleton className="h-9 w-32" />
      <div className="flex items-center gap-2">
        <EcoSkeleton className="h-5 w-12 rounded-full" />
        <EcoSkeleton className="h-3.5 w-28" />
      </div>
    </div>
  );
}

// ─── Stats row skeleton ───────────────────────────────────────────────────────

interface EcoStatsRowSkeletonProps {
  count?: number;
  className?: string;
}

const STATS_GRID: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export function EcoStatsRowSkeleton({ count = 4, className }: EcoStatsRowSkeletonProps) {
  return (
    <div className={cn("grid gap-4", STATS_GRID[count] ?? "grid-cols-2 lg:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <EcoStatCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Idea / content card skeleton ─────────────────────────────────────────────

export function EcoCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border bg-card overflow-hidden", className)}>
      {/* Thumbnail */}
      <EcoSkeleton className="aspect-video w-full rounded-none" />

      <div className="space-y-3.5 p-5">
        {/* Author row */}
        <div className="flex items-center gap-3">
          <EcoSkeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <EcoSkeleton className="h-3.5 w-28" />
            <EcoSkeleton className="h-3 w-20" />
          </div>
          <EcoSkeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <EcoSkeleton className="h-5 w-full" />
          <EcoSkeleton className="h-5 w-4/5" />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <EcoSkeleton className="h-3.5 w-full" />
          <EcoSkeleton className="h-3.5 w-11/12" />
          <EcoSkeleton className="h-3.5 w-3/4" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <EcoSkeleton className="h-8 w-20 rounded-lg" />
          <EcoSkeleton className="h-8 w-20 rounded-lg" />
          <div className="ml-auto">
            <EcoSkeleton className="size-8 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card grid skeleton ───────────────────────────────────────────────────────

interface EcoCardGridSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const GRID_COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function EcoCardGridSkeleton({
  count = 6,
  columns = 3,
  className,
}: EcoCardGridSkeletonProps) {
  return (
    <div className={cn("grid gap-5", GRID_COLS[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <EcoCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Table skeleton ───────────────────────────────────────────────────────────

interface EcoTableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

// Fixed column widths to avoid hydration issues
const COL_WIDTHS = ["w-1/4", "w-1/5", "w-1/6", "w-1/6", "w-1/6", "w-1/8"];

export function EcoTableSkeleton({
  rows = 7,
  columns = 5,
  showHeader = true,
  className,
}: EcoTableSkeletonProps) {
  const cols = Math.min(columns, COL_WIDTHS.length);

  return (
    <div className={cn("w-full overflow-hidden rounded-xl border bg-card", className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center gap-4 border-b bg-muted/40 px-4 py-3.5">
          {Array.from({ length: cols }).map((_, i) => (
            <EcoSkeleton
              key={i}
              className={cn("h-4 shrink-0", i === cols - 1 ? "ml-auto w-16" : COL_WIDTHS[i])}
            />
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-4 px-4 py-3.5">
            {/* First col: avatar + text */}
            <div className="flex w-1/4 shrink-0 items-center gap-3">
              <EcoSkeleton className="size-8 shrink-0 rounded-full" />
              <EcoSkeleton className="h-4 flex-1" />
            </div>

            {/* Middle cols */}
            {Array.from({ length: cols - 2 }).map((_, colIdx) => (
              <EcoSkeleton
                key={colIdx}
                className={cn("h-4 shrink-0", COL_WIDTHS[colIdx + 1])}
                style={{ opacity: 1 - colIdx * 0.12 }}
              />
            ))}

            {/* Last col: badge */}
            <div className="ml-auto shrink-0">
              <EcoSkeleton className="h-6 w-18 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chart bar heights (fixed — no Math.random to avoid hydration mismatch) ───
const CHART_BARS = [45, 72, 38, 65, 85, 52, 70, 42, 68, 55, 78, 48];

// ─── Dashboard skeleton ───────────────────────────────────────────────────────

export function EcoDashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 p-5 lg:p-7", className)}>
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <EcoSkeleton className="h-7 w-52" />
          <EcoSkeleton className="h-4 w-72" />
        </div>
        <EcoSkeleton className="h-10 w-38 rounded-xl" />
      </div>

      {/* Stats */}
      <EcoStatsRowSkeleton count={4} />

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main chart */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <EcoSkeleton className="h-5 w-40" />
            <EcoSkeleton className="h-8 w-28 rounded-lg" />
          </div>

          {/* Bars */}
          <div className="flex items-end gap-1.5 h-44 pt-2">
            {CHART_BARS.map((height, i) => (
              <EcoSkeleton
                key={i}
                className="flex-1 rounded-t-md"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          {/* X-axis labels */}
          <div className="flex gap-1.5">
            {CHART_BARS.map((_, i) => (
              <EcoSkeleton key={i} className="flex-1 h-3" />
            ))}
          </div>
        </div>

        {/* Side: progress list */}
        <div className="rounded-2xl border bg-card p-5 space-y-5">
          <EcoSkeleton className="h-5 w-32" />
          {[70, 55, 82, 40, 63].map((val, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <EcoSkeleton className="h-3.5 w-24" />
                <EcoSkeleton className="h-3.5 w-10" />
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <EcoSkeleton className="h-full rounded-full" style={{ width: `${val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <EcoTableSkeleton rows={5} columns={5} />
    </div>
  );
}

// ─── Blog card skeleton ───────────────────────────────────────────────────────

export function EcoBlogCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border bg-card overflow-hidden", className)}>
      <EcoSkeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-5">
        {/* Tags */}
        <div className="flex items-center gap-2">
          <EcoSkeleton className="h-5 w-16 rounded-full" />
          <EcoSkeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <EcoSkeleton className="h-6 w-full" />
          <EcoSkeleton className="h-6 w-3/4" />
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5">
          <EcoSkeleton className="h-4 w-full" />
          <EcoSkeleton className="h-4 w-5/6" />
        </div>

        {/* Author + date */}
        <div className="flex items-center gap-3 pt-2 border-t">
          <EcoSkeleton className="size-7 rounded-full" />
          <EcoSkeleton className="h-3.5 w-28" />
          <EcoSkeleton className="h-3.5 w-20 ml-auto" />
        </div>
      </div>
    </div>
  );
}

// ─── Blog grid skeleton ───────────────────────────────────────────────────────

export function EcoBlogGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <EcoBlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Profile skeleton ─────────────────────────────────────────────────────────

export function EcoProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Cover + avatar */}
      <div className="relative">
        <EcoSkeleton className="h-40 w-full rounded-2xl sm:h-52 rounded-none" />
        <div className="absolute -bottom-10 left-6">
          <EcoSkeleton className="size-20 rounded-full ring-4 ring-background sm:size-24" />
        </div>
      </div>

      {/* Info */}
      <div className="pt-12 space-y-2.5 px-4">
        <EcoSkeleton className="h-7 w-44" />
        <EcoSkeleton className="h-4 w-32" />
        <EcoSkeleton className="h-4 w-72" />
        <div className="flex flex-wrap gap-3 pt-3">
          <EcoSkeleton className="h-9 w-28 rounded-lg" />
          <EcoSkeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Stats strip */}
      <div className="mx-4 grid grid-cols-3 gap-4 rounded-2xl border p-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <EcoSkeleton className="h-7 w-16" />
            <EcoSkeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="px-4">
        <EcoCardGridSkeleton count={3} columns={3} />
      </div>
    </div>
  );
}

// ─── Form skeleton ────────────────────────────────────────────────────────────

interface EcoFormSkeletonProps {
  fields?: number;
  className?: string;
}

export function EcoFormSkeleton({ fields = 4, className }: EcoFormSkeletonProps) {
  return (
    <div className={cn("space-y-5", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <EcoSkeleton className="h-4 w-28" />
          <EcoSkeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <div className="flex gap-3 pt-3">
        <EcoSkeleton className="h-10 w-32 rounded-lg" />
        <EcoSkeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Full-page layout skeleton ────────────────────────────────────────────────

export function EcoFullPageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("min-h-screen w-full space-y-12 p-6", className)}>
      {/* Navbar */}
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <EcoSkeleton className="size-8 rounded-lg" />
          <EcoSkeleton className="h-5 w-24" />
        </div>
        <div className="hidden items-center gap-6 sm:flex">
          {(["w-12", "w-10", "w-14", "w-16"] as const).map((w, i) => (
            <EcoSkeleton key={i} className={cn("h-4", w)} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <EcoSkeleton className="size-8 rounded-full" />
          <EcoSkeleton className="h-8 w-16 rounded-md" />
          <EcoSkeleton className="h-8 w-24 rounded-md" />
        </div>
      </nav>

      {/* Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <EcoSkeleton className="h-6 w-44 rounded-full" />
          <div className="space-y-3">
            <EcoSkeleton className="h-11 w-full" />
            <EcoSkeleton className="h-11 w-4/5" />
            <EcoSkeleton className="h-11 w-3/5" />
          </div>
          <div className="space-y-2">
            <EcoSkeleton className="h-5 w-full" />
            <EcoSkeleton className="h-5 w-3/4" />
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <EcoSkeleton className="h-11 w-36 rounded-xl" />
            <EcoSkeleton className="h-11 w-36 rounded-xl" />
          </div>
        </div>
        <EcoSkeleton className="aspect-video w-full rounded-2xl" />
      </section>

      {/* Stats */}
      <EcoStatsRowSkeleton count={4} />

      {/* Feature cards */}
      <EcoCardGridSkeleton count={6} columns={3} />
    </div>
  );
}

// ─── Idea detail skeleton ─────────────────────────────────────────────────────

export function EcoIdeaDetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 p-5 lg:p-8 max-w-4xl mx-auto", className)}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <EcoSkeleton className="h-4 w-16" />
        <EcoSkeleton className="h-3 w-3 rounded-full" />
        <EcoSkeleton className="h-4 w-24" />
      </div>

      {/* Hero image */}
      <EcoSkeleton className="aspect-video w-full rounded-2xl" />

      {/* Author + meta */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <EcoSkeleton className="size-10 rounded-full" />
          <div className="space-y-1.5">
            <EcoSkeleton className="h-4 w-32" />
            <EcoSkeleton className="h-3.5 w-24" />
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <EcoSkeleton className="h-6 w-20 rounded-full" />
          <EcoSkeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-3">
        <EcoSkeleton className="h-9 w-full" />
        <EcoSkeleton className="h-9 w-4/5" />
      </div>

      {/* Body paragraphs */}
      <div className="space-y-4">
        {[1, 0.95, 0.88, 0.92, 0.7].map((opacity, i) => (
          <EcoSkeleton key={i} className="h-4 w-full" style={{ opacity }} />
        ))}
        <div className="pt-2 space-y-4">
          {[1, 0.93, 0.85, 0.6].map((opacity, i) => (
            <EcoSkeleton key={i} className="h-4 w-full" style={{ opacity }} />
          ))}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
        <EcoSkeleton className="h-10 w-28 rounded-xl" />
        <EcoSkeleton className="h-10 w-28 rounded-xl" />
        <div className="ml-auto flex gap-2">
          <EcoSkeleton className="size-10 rounded-xl" />
          <EcoSkeleton className="size-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
