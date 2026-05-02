"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { IIdeaResponse } from "@/types/idea.type";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ImageIcon,
  LeafIcon,
  LightbulbIcon,
  SearchIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UserIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";

// ─── Local utility types & helpers ───────────────────────────────────────────

type ImageLike = string | { url?: unknown };
type VoteLike = string | { type?: unknown };

const DEFAULT_IMAGE = "/window.svg";

const normalizeImageUrls = (images: unknown): string[] => {
  if (!Array.isArray(images)) return [];
  return images
    .map((item) => {
      const typed = item as ImageLike;
      if (typeof typed === "string") return typed.trim();
      if (typed && typeof typed === "object") {
        const url = (typed as { url?: unknown }).url;
        return typeof url === "string" ? url.trim() : "";
      }
      return "";
    })
    .filter(Boolean);
};

const getVoteType = (vote: VoteLike): "UP" | "DOWN" | null => {
  if (vote === "UP" || vote === "DOWN") return vote;
  if (vote && typeof vote === "object") {
    const t = (vote as { type?: unknown }).type;
    return t === "UP" || t === "DOWN" ? t : null;
  }
  return null;
};

const safeFormatDate = (value: unknown) => {
  if (!value) return "";
  const d =
    value instanceof Date
      ? value
      : typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionBlock = ({
  icon: Icon,
  title,
  accentColor = "emerald",
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  accentColor?: "emerald" | "teal" | "blue";
  children: React.ReactNode;
  className?: string;
}) => {
  const colors = {
    emerald: "border-emerald-500 text-emerald-600 dark:text-emerald-400",
    teal: "border-teal-500 text-teal-600 dark:text-teal-400",
    blue: "border-blue-500 text-blue-600 dark:text-blue-400",
  };
  return (
    <div
      className={cn(
        "animate-eco-fade-up rounded-2xl border bg-card p-5 sm:p-6",
        className,
      )}
    >
      <div className={cn("mb-4 flex items-center gap-2.5 border-l-4 pl-3", colors[accentColor])}>
        <Icon className="h-4 w-4 shrink-0" />
        <h2 className="text-sm font-bold uppercase tracking-widest">{title}</h2>
      </div>
      {children}
    </div>
  );
};

const IdeaImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <div
    className={cn(
      "group overflow-hidden rounded-xl border bg-muted/20",
      className,
    )}
  >
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE;
      }}
    />
  </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────

export interface IdeaDetailViewProps {
  idea: IIdeaResponse;
  isPurchased?: boolean;
  onVote?: (type: "UP" | "DOWN") => Promise<void>;
  onPurchase?: () => void;
  isPurchasePending?: boolean;
  isVoting?: boolean;
  voteError?: string;
  backHref?: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function IdeaDetailView({
  idea,
  isPurchased = false,
  onVote,
  onPurchase,
  isPurchasePending = false,
  isVoting = false,
  voteError,
  backHref = "/idea",
}: IdeaDetailViewProps) {
  const imageUrls = normalizeImageUrls(idea.images);
  const coverImage = imageUrls[0] || DEFAULT_IMAGE;
  const descriptionImage = imageUrls[1] || "";
  const solutionImage = imageUrls[2] || "";
  const extraImages = imageUrls.slice(3);

  const votes = Array.isArray(idea.votes)
    ? (idea.votes as unknown as VoteLike[])
    : [];
  const upVotes = votes.filter((v) => getVoteType(v) === "UP").length;
  const downVotes = votes.filter((v) => getVoteType(v) === "DOWN").length;

  const authorName = idea.author?.name || idea.authorName || "Unknown";
  const initials = authorName.charAt(0).toUpperCase();
  const createdAt = safeFormatDate(idea.createdAt);

  return (
    <article className="w-full">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative h-72 overflow-hidden sm:h-96 lg:h-[28rem]">
        {/* Ken Burns cover image */}
        <img
          src={coverImage}
          alt={idea.title}
          className="absolute inset-0 h-full w-full object-cover animate-eco-ken-burns"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE;
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10" />

        {/* Back button */}
        <Link
          href={backHref}
          className={cn(
            "absolute left-4 top-4 z-10",
            "flex items-center gap-1.5 rounded-full px-3 py-1.5",
            "border border-white/25 bg-black/35 text-xs font-semibold text-white backdrop-blur-md",
            "transition-all duration-200 hover:bg-black/50 hover:gap-2.5",
          )}
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Ideas
        </Link>

        {/* Title area — bottom of hero */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-8">
          {/* Badges row */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {idea.category?.name && (
              <span className="inline-flex items-center rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                <LeafIcon className="mr-1.5 h-3 w-3" />
                {idea.category.name}
              </span>
            )}
            {idea.isPaid ? (
              <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                {typeof idea.price === "number" ? `$${idea.price}` : "Paid"}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                Free
              </span>
            )}
          </div>

          <h1 className="font-heading text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            {idea.title}
          </h1>

          {/* Author + date */}
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-sm text-white/75">
            <span className="flex items-center gap-1.5">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600/80 text-[11px] font-bold text-white">
                {initials}
              </span>
              {authorName}
            </span>
            {createdAt && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                {createdAt}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Vote stats pill row */}
        <div className="mb-8 flex flex-wrap items-center gap-3 animate-eco-fade-up">
          <div className="flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-sm shadow-sm">
            <ThumbsUpIcon className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold tabular-nums">{upVotes}</span>
            <span className="text-muted-foreground">upvotes</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-sm shadow-sm">
            <ThumbsDownIcon className="h-4 w-4 text-red-400" />
            <span className="font-semibold tabular-nums">{downVotes}</span>
            <span className="text-muted-foreground">downvotes</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-sm shadow-sm">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold tabular-nums">{votes.length}</span>
            <span className="text-muted-foreground">total votes</span>
          </div>
        </div>

        <div className="space-y-5">
          {/* Problem Statement */}
          <SectionBlock
            icon={SearchIcon}
            title="Problem Statement"
            accentColor="teal"
            className="animate-delay-100"
          >
            <p className="whitespace-pre-line text-sm leading-7 text-foreground/85">
              {idea.problemStatement || "—"}
            </p>
          </SectionBlock>

          {/* Description */}
          <SectionBlock
            icon={LightbulbIcon}
            title="Description"
            accentColor="emerald"
            className="animate-delay-200"
          >
            {descriptionImage && (
              <IdeaImage
                src={descriptionImage}
                alt="Description visual"
                className="mb-4 h-56 sm:h-72"
              />
            )}
            <p className="whitespace-pre-line text-sm leading-7 text-foreground/85">
              {idea.description || "—"}
            </p>
          </SectionBlock>

          {/* Solution */}
          <SectionBlock
            icon={ZapIcon}
            title="Proposed Solution"
            accentColor="blue"
            className="animate-delay-300"
          >
            {solutionImage && (
              <IdeaImage
                src={solutionImage}
                alt="Solution visual"
                className="mb-4 h-56 sm:h-72"
              />
            )}
            <p className="whitespace-pre-line text-sm leading-7 text-foreground/85">
              {idea.solution || "—"}
            </p>
          </SectionBlock>

          {/* Gallery */}
          {extraImages.length > 0 && (
            <SectionBlock
              icon={ImageIcon}
              title="Gallery"
              accentColor="emerald"
              className="animate-delay-400"
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {extraImages.map((url, idx) => (
                  <IdeaImage
                    key={url}
                    src={url}
                    alt={`Gallery image ${idx + 1}`}
                    className="aspect-square"
                  />
                ))}
              </div>
            </SectionBlock>
          )}

          {/* Action bar */}
          {(onVote || (onPurchase && idea.isPaid)) && (
            <div className="animate-eco-fade-up animate-delay-400 rounded-2xl border bg-card p-5 sm:p-6">
              <Separator className="mb-5" />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Vote buttons */}
                {onVote && (
                  <div className="flex flex-1 flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isVoting}
                      onClick={() => onVote("UP")}
                      className="flex-1 gap-2 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                    >
                      <ThumbsUpIcon className="h-4 w-4" />
                      Upvote
                      <span className="tabular-nums text-muted-foreground">
                        ({upVotes})
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isVoting}
                      onClick={() => onVote("DOWN")}
                      className="flex-1 gap-2 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <ThumbsDownIcon className="h-4 w-4" />
                      Downvote
                      <span className="tabular-nums text-muted-foreground">
                        ({downVotes})
                      </span>
                    </Button>
                  </div>
                )}

                {/* Purchase / unlock */}
                {onPurchase && idea.isPaid && (
                  <Button
                    type="button"
                    disabled={isPurchasePending || isPurchased}
                    onClick={onPurchase}
                    className={cn(
                      "gap-2 rounded-xl px-6 transition-all duration-200",
                      isPurchased
                        ? "bg-neutral-600 text-white hover:bg-neutral-700"
                        : "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700",
                    )}
                  >
                    {isPurchased ? (
                      <>
                        <CheckCircle2Icon className="h-4 w-4" />
                        Purchased
                      </>
                    ) : (
                      <>
                        <LeafIcon className="h-4 w-4" />
                        Unlock ·{" "}
                        {typeof idea.price === "number"
                          ? `$${idea.price}`
                          : "Paid"}
                      </>
                    )}
                  </Button>
                )}
              </div>

              {voteError && (
                <p className="mt-3 text-xs text-destructive">{voteError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
