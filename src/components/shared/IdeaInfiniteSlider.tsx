"use client";

import { cn } from "@/lib/utils";
import type { IIdeaResponse } from "@/types/idea.type";
import { Skeleton } from "@/components/ui/skeleton";

// ── helpers ───────────────────────────────────────────────────────────────────

const DEFAULT_IMAGE = "/window.svg";

const normalizeFirstImage = (images: unknown): string => {
  if (!Array.isArray(images) || images.length === 0) return DEFAULT_IMAGE;
  const first = images[0];
  if (typeof first === "string") return first.trim() || DEFAULT_IMAGE;
  if (first && typeof first === "object" && "url" in first) {
    const url = (first as { url?: unknown }).url;
    return typeof url === "string"
      ? url.trim() || DEFAULT_IMAGE
      : DEFAULT_IMAGE;
  }
  return DEFAULT_IMAGE;
};

const safeShortDate = (value: unknown): string => {
  if (!value) return "";
  const date =
    value instanceof Date
      ? value
      : typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
  }).format(date);
};

// ── IdeaSlideCard — proper card (image top, text below) ──────────────────────

const IdeaSlideCard = ({ idea }: { idea: IIdeaResponse }) => {
  const coverImage = normalizeFirstImage(idea.images);
  const authorName =
    (idea as any)?.author?.name || (idea as any)?.authorName || "";
  const createdAt = safeShortDate(idea.createdAt);
  const category = (idea as any)?.category?.name as string | undefined;
  const initials = String(authorName).charAt(0).toUpperCase();
  const isPaid = idea.isPaid;
  const price = (idea as any).price;

  return (
    <div
      className={cn(
        "group flex w-60 shrink-0 flex-col overflow-hidden rounded-2xl bg-card sm:w-64",
        "ring-1 ring-border shadow-sm",
        "cursor-default select-none",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-lg hover:shadow-emerald-900/10 hover:ring-emerald-200/70 dark:hover:ring-emerald-800/50",
      )}
    >
      {/* Image */}
      <div className="relative h-36 shrink-0 overflow-hidden sm:h-40">
        <img
          src={coverImage}
          alt={idea.title || "Idea"}
          aria-hidden="true"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE;
          }}
        />

        {/* Category badge — top left */}
        {category ? (
          <div className="absolute left-2.5 top-2.5">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-black/45 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-md">
              {category}
            </span>
          </div>
        ) : null}

        {/* Price badge — top right */}
        <div className="absolute right-2.5 top-2.5">
          {isPaid ? (
            <span className="inline-flex items-center rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
              {typeof price === "number" ? `$${price}` : "Paid"}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-white/25 bg-black/40 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-md">
              Free
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Title */}
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground">
          {idea.title || "Untitled Idea"}
        </h3>

        {/* Author + date */}
        <div className="mt-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-bold uppercase text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
            {initials}
          </span>
          <span className="truncate font-medium text-foreground/70">
            {authorName}
          </span>
          {createdAt ? (
            <span className="ml-auto shrink-0">{createdAt}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

const SliderSkeleton = () => (
  <div className="flex gap-4 py-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="flex w-60 shrink-0 flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border shadow-sm sm:w-64"
      >
        <Skeleton className="h-36 w-full rounded-none sm:h-40" />
        <div className="flex flex-col gap-2 p-3">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
          <div className="mt-1 flex items-center gap-1.5">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ── IdeaInfiniteSlider — public-facing horizontal scroll ──────────────────────

interface IdeaInfiniteSliderProps {
  ideas: IIdeaResponse[];
  isLoading?: boolean;
  className?: string;
}

export const IdeaInfiniteSlider = ({
  ideas,
  isLoading,
  className,
}: IdeaInfiniteSliderProps) => {
  if (isLoading) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <SliderSkeleton />
      </div>
    );
  }

  if (!ideas.length) return null;

  // Duplicate for seamless right→left loop
  const doubled = [...ideas, ...ideas];

  return (
    <div className={cn("eco-idea-slider overflow-hidden", className)}>
      <div
        className="eco-idea-slider-track flex gap-4 py-2"
        style={{ width: "max-content" }}
        aria-label="Live ideas from the community"
      >
        {doubled.map((idea, idx) => (
          <IdeaSlideCard key={`${idea.id}-${idx}`} idea={idea} />
        ))}
      </div>
    </div>
  );
};
