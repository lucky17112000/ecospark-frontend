"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const DEFAULT_IMAGE = "/window.svg";

export type IdeaCardShellProps = {
  coverImage: string;
  defaultImage?: string;
  title: string;
  problemStatement?: string;
  authorName: string;
  createdAt?: string;
  category?: string;
  isPaid?: boolean;
  price?: number;
  topRightBadge?: ReactNode;
  children?: ReactNode;
  footer: ReactNode;
  className?: string;
};

export function IdeaCardShell({
  coverImage,
  defaultImage = DEFAULT_IMAGE,
  title,
  problemStatement,
  authorName,
  createdAt,
  category,
  isPaid,
  price,
  topRightBadge,
  children,
  footer,
  className,
}: IdeaCardShellProps) {
  const initials = (authorName ?? "?").charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl bg-card",
        "ring-1 ring-border shadow-sm",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-900/10 hover:ring-emerald-200/80 dark:hover:ring-emerald-800/60",
        className,
      )}
    >
      {/* ── Image (clean — text is NOT overlaid here) ─────────────── */}
      <div className="relative h-48 shrink-0 overflow-hidden sm:h-52">
        <img
          src={coverImage}
          alt={title || "Idea image"}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultImage;
          }}
        />

        {/* Category badge — top left */}
        {category ? (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md">
              {category}
            </span>
          </div>
        ) : null}

        {/* Price / status badges — top right */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          {isPaid ? (
            <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              {typeof price === "number" ? `$${price}` : "Paid"}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
              Free
            </span>
          )}
          {topRightBadge}
        </div>
      </div>

      {/* ── Card body — title + content BELOW image ───────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-4">

        {/* Title + problem statement */}
        <div className="space-y-1.5">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-foreground sm:text-base">
            {title || "(Untitled idea)"}
          </h3>
          {problemStatement ? (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {problemStatement}
            </p>
          ) : null}
        </div>

        {/* Author row */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold uppercase text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
            {initials}
          </span>
          <span className="truncate font-medium text-foreground/80">{authorName}</span>
          {createdAt ? (
            <span className="ml-auto shrink-0 text-muted-foreground">{createdAt}</span>
          ) : null}
        </div>

        {/* Optional extra slot (feedback collapsible, vote meta, etc.) */}
        {children ? <div className="space-y-2">{children}</div> : null}

        {/* Footer actions */}
        <div className="mt-auto pt-1">{footer}</div>
      </div>
    </div>
  );
}
