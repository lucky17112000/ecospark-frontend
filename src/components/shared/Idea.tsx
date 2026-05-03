"use client";

import { getIdea } from "@/services/idea.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { IIdeaResponse } from "@/types/idea.type";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Search,
  Sprout,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { castVote } from "@/services/vote.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Input } from "../ui/input";
import AppTooltip from "./Tooltip";
import { createPurchaseAction } from "@/services/purchase.service";
import { IdeaCardShell } from "./IdeaCardShell";
import { EcoCardSkeleton, EcoSpinner } from "./EcoLoading";

// ─── Pagination helper ────────────────────────────────────────────────────────
type pageItem = number | "ellipsis";
const getPaginationItems = (currentPage: number, totalPages: number) => {
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  if (safeTotal <= 7) {
    return Array.from({ length: safeTotal }, (_, idx) => idx + 1) as pageItem[];
  }
  const items: pageItem[] = [3];
  const left = Math.max(2, safeCurrent - 1);
  const right = Math.min(safeTotal - 1, safeCurrent + 1);
  if (left >= 2) items.push("ellipsis");
  for (let p = left; p <= right; p += 1) items.push(p);
  if (right < safeTotal - 1) items.push("ellipsis");
  items.push(safeTotal);
  return items;
};

const DEFAULT_IDEA_IMAGE = "/window.svg";

type ImageLike = string | { url?: unknown };
type VoteLike = string | { type?: unknown };
type VoteRecordLike = { userId?: unknown; type?: unknown; voteType?: unknown };
type PurchaseRecordLike = { userId?: unknown; paymentStatus?: unknown };

const getVoteType = (vote: VoteLike): "UP" | "DOWN" | null => {
  if (vote === "UP" || vote === "DOWN") return vote;
  if (vote && typeof vote === "object") {
    const maybeType = (vote as { type?: unknown }).type;
    return maybeType === "UP" || maybeType === "DOWN" ? maybeType : null;
  }
  return null;
};

const getVoteTypeFromRecord = (vote: unknown): "UP" | "DOWN" | null => {
  if (vote === "UP" || vote === "DOWN") return vote;
  if (!vote || typeof vote !== "object") return null;
  const record = vote as VoteRecordLike;
  const maybeType = record.type ?? record.voteType;
  return maybeType === "UP" || maybeType === "DOWN" ? maybeType : null;
};

const getVoteUserIdFromRecord = (vote: unknown): string | null => {
  if (!vote || typeof vote !== "object") return null;
  const record = vote as VoteRecordLike;
  return typeof record.userId === "string" ? record.userId : null;
};

const isIdeaPurchasedByUser = (idea: IIdeaResponse | null, userId: string) => {
  if (!idea?.isPaid) return false;
  const purchases = (idea as unknown as { purchases?: unknown }).purchases;
  if (!Array.isArray(purchases) || purchases.length === 0) return false;
  return purchases.some((purchase) => {
    if (!purchase || typeof purchase !== "object") return false;
    const record = purchase as PurchaseRecordLike;
    if (record.paymentStatus !== "PAID") return false;
    if (typeof record.userId === "string") return record.userId === userId;
    return true;
  });
};

const normalizeImageUrls = (images: unknown): string[] => {
  if (!Array.isArray(images)) return [];
  const urls = images
    .map((item) => {
      const typedItem = item as ImageLike;
      if (typeof typedItem === "string") return typedItem.trim();
      if (typedItem && typeof typedItem === "object") {
        const url = typedItem.url;
        return typeof url === "string" ? url.trim() : "";
      }
      return "";
    })
    .filter(Boolean);
  return urls;
};

const safeFormatDate = (value: unknown) => {
  if (!value) return "";
  const date =
    value instanceof Date
      ? value
      : typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

const pickImage = (urls: string[], preferredIndex: number): string => {
  return urls[preferredIndex] || urls[0] || DEFAULT_IDEA_IMAGE;
};

// ─── Main component ───────────────────────────────────────────────────────────

const AllIdeas = ({ user }: { user?: unknown }) => {
  // ── State ────────────────────────────────────────────────────────────────
  const [voteErrors, setVoteErrors] = useState<Record<string, string>>({});
  const [duplicateVoteDialog, setDuplicateVoteDialog] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  // Search state — preserved as-is for future commands
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  const userId =
    user &&
    typeof user === "object" &&
    "id" in (user as Record<string, unknown>)
      ? String((user as Record<string, unknown>).id ?? "")
      : user &&
          typeof user === "object" &&
          "data" in (user as Record<string, unknown>) &&
          (user as { data?: unknown }).data &&
          typeof (user as { data?: unknown }).data === "object" &&
          "id" in ((user as { data?: unknown }).data as Record<string, unknown>)
        ? String(
            (((user as { data?: unknown }).data as Record<string, unknown>)
              .id as unknown) ?? "",
          )
        : "";

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["idea", page, limit, debouncedSearch],
    queryFn: () =>
      getIdea({
        page,
        limit,
        status: "APPROVED",
        searchTerm: debouncedSearch || undefined,
      }),
  });

  const purchaseMutation = useMutation({
    mutationFn: createPurchaseAction,
    onSuccess: (res) => {
      const url = res?.data?.sessionUrl;
      if (typeof url === "string" && url.length > 0) {
        window.location.assign(url);
        return;
      }
      console.error("sessionUrl missing in purchase response:", res);
    },
    onError: (err) => {
      console.error("Purchase failed:", err);
    },
  });

  const meta = data?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const currentPage = Math.min(Math.max(1, meta?.page ?? page), totalPages);
  const totalItems = meta?.total ?? undefined;

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );
  const showingRange = useMemo(() => {
    if (typeof totalItems !== "number") return null;
    if (totalItems <= 0) return null;
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalItems);
    return { start, end, total: totalItems };
  }, [currentPage, limit, totalItems]);

  const { mutateAsync, isPending: isVoting } = useMutation({
    mutationFn: (payload: { ideaId: string; voteType: "UP" | "DOWN" }) =>
      castVote(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["idea"] });
    },
  });

  const clearVoteError = (ideaId: string) => {
    setVoteErrors((prev) => {
      if (!prev[ideaId]) return prev;
      const next = { ...prev };
      delete next[ideaId];
      return next;
    });
  };

  const handleVote = async (idea: IIdeaResponse, voteType: "UP" | "DOWN") => {
    const ideaId = idea.id;
    if (
      userId &&
      Array.isArray((idea as unknown as { votes?: unknown }).votes)
    ) {
      const votes = (idea as unknown as { votes: unknown[] }).votes;
      const existing = votes.find((vote) => {
        const voteUserId = getVoteUserIdFromRecord(vote);
        return voteUserId && voteUserId === userId;
      });
      const existingType = getVoteTypeFromRecord(existing);
      if (existingType && existingType === voteType) {
        setDuplicateVoteDialog({
          open: true,
          message: "You have already voted for this idea with the same type.",
        });
        return;
      }
    }
    clearVoteError(ideaId);
    try {
      await mutateAsync({ ideaId, voteType });
      clearVoteError(ideaId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to cast vote. Please try again.";
      const normalized = message.toLowerCase();
      const isDuplicateVote =
        normalized.includes("already voted") &&
        (normalized.includes("same type") || normalized.includes("same"));
      if (isDuplicateVote) {
        setDuplicateVoteDialog({ open: true, message });
        return;
      }
      setVoteErrors((prev) => ({ ...prev, [ideaId]: message }));
    }
  };

  const ideas = useMemo(
    () => (Array.isArray(data?.data) ? data.data : ([] as IIdeaResponse[])),
    [data],
  );

  // Search-awareness flags — used by parent commands
  const isSearching = debouncedSearch.length > 0;
  const showSkeletonGrid = isLoading || (isFetching && isSearching);

  const underReviewIdeas = useMemo(
    () => ideas.filter((idea) => idea?.status === "APPROVED"),
    [ideas],
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full animate-eco-fade-down animate-delay-200">
      {/* ══ HERO SEARCH SECTION ════════════════════════════════════════════ */}
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-emerald-100/70 bg-linear-to-br from-emerald-50/90 via-white to-teal-50/70 px-6 py-12 dark:border-emerald-900/30 dark:from-emerald-950/40 dark:via-card dark:to-teal-950/20">
        {/* Decorative background blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-emerald-300/60 to-transparent dark:via-emerald-700/40"
        />

        <div className="relative flex flex-col items-center gap-7">
          {/* Brand chip */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-1.5 shadow-sm dark:border-emerald-800/50 dark:bg-emerald-950/60">
            <Sprout className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
              EcoSpark Ideas
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2.5 text-center">
            <h1 className="bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-emerald-300 dark:via-emerald-400 dark:to-teal-300 sm:text-4xl">
              Discover Eco Ideas
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
              Browse, vote, and get inspired by community-driven sustainability
              solutions from around the world.
            </p>
          </div>

          {/* ── Search input ─────────────────────────────────────────────── */}
          <div className="w-full max-w-xl">
            {/* Outer glow wrapper */}
            <div className="group relative">
              {/* Animated gradient border on focus */}
              <div className="absolute -inset-px rounded-2xl bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-500 opacity-0 blur-sm transition-all duration-300 group-focus-within:opacity-50 dark:group-focus-within:opacity-30" />

              <div className="relative flex items-center">
                {/* Left icon: spinner while fetching, search icon otherwise */}
                <div className="pointer-events-none absolute left-4 z-10 transition-colors duration-200 text-muted-foreground group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                  {isFetching && isSearching ? (
                    <EcoSpinner size="xs" />
                  ) : (
                    <Search className="size-4" />
                  )}
                </div>

                <AppTooltip
                  side="bottom"
                  delay={600}
                  content={
                    <span className="flex items-center gap-1.5">
                      <Sprout className="size-3.5 shrink-0 text-emerald-300" />
                      Search by title, problem statement, or solution
                    </span>
                  }
                  trigger={
                    <Input
                      ref={searchInputRef}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search ideas — title, solution, or problem…"
                      className={cn(
                        "relative h-13 rounded-2xl border bg-white pl-11 pr-11 text-sm shadow-sm",
                        "placeholder:text-muted-foreground/55",
                        "border-emerald-100 transition-all duration-200",
                        "focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none",
                        "dark:border-emerald-900/40 dark:bg-card dark:focus:border-emerald-700/60 dark:focus:ring-emerald-600/20",
                      )}
                    />
                  }
                />

                {/* Clear button */}
                {searchText ? (
                  <button
                    type="button"
                    onClick={() => setSearchText("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-all duration-150 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Search status text */}
            <div className="mt-3 min-h-5 text-center text-sm">
              {debouncedSearch ? (
                <p className="animate-eco-fade-in text-muted-foreground">
                  Showing results for{" "}
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-800/40">
                    {debouncedSearch}
                  </span>
                </p>
              ) : (
                <p className="text-muted-foreground/50 text-xs">
                  Type to filter ideas by keyword
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ DUPLICATE VOTE DIALOG ══════════════════════════════════════════ */}
      <AlertDialog
        open={duplicateVoteDialog.open}
        onOpenChange={(open) =>
          setDuplicateVoteDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vote already submitted</AlertDialogTitle>
            <AlertDialogDescription>
              {duplicateVoteDialog.message ||
                "You already voted for this idea with the same type."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>OK</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ══ IDEAS GRID SECTION ════════════════════════════════════════════ */}
      <div className="mx-auto w-full max-w-6xl px-4 py-2">
        {/* Section header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {isSearching ? "Search Results" : "All Approved Ideas"}
            </h2>
            {!showSkeletonGrid && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800/50">
                {underReviewIdeas.length}
              </span>
            )}
          </div>

          {showingRange && !showSkeletonGrid && (
            <p className="text-xs text-muted-foreground">
              {showingRange.start}–{showingRange.end} of {showingRange.total}
            </p>
          )}
        </div>

        {/* ── Skeleton grid ─────────────────────────────────────────────── */}
        {showSkeletonGrid && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit }, (_, idx) => (
              <EcoCardSkeleton key={`idea-skeleton-${idx}`} />
            ))}
          </div>
        )}

        {/* ── Error state ───────────────────────────────────────────────── */}
        {!showSkeletonGrid && isError && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-3xl border border-red-100 bg-red-50/60 px-6 py-16 text-center dark:border-red-900/30 dark:bg-red-950/20">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="size-7 text-red-500" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-foreground">
                Something went wrong
              </p>
              <p className="max-w-xs text-sm text-muted-foreground">
                We couldn&apos;t load ideas right now. Please try again.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["idea"] })
              }
            >
              Retry
            </Button>
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {!showSkeletonGrid && !isError && underReviewIdeas.length === 0 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-emerald-200/80 bg-linear-to-b from-emerald-50/60 to-white px-6 py-16 text-center dark:border-emerald-800/30 dark:from-emerald-950/20 dark:to-card">
            {/* Animated icon */}
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200/60 animation-duration-[2s] dark:bg-emerald-800/30" />
              <div className="relative inline-flex size-16 items-center justify-center rounded-2xl bg-emerald-100 shadow-inner dark:bg-emerald-900/40">
                {debouncedSearch ? (
                  <Search className="size-7 text-emerald-500" />
                ) : (
                  <Sprout className="size-7 text-emerald-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-base font-semibold text-foreground">
                {debouncedSearch ? "No matching ideas" : "No ideas yet"}
              </p>
              <p className="max-w-xs text-sm text-muted-foreground">
                {debouncedSearch
                  ? `We couldn't find any results for "${debouncedSearch}". Try a different keyword.`
                  : "There are no approved ideas to show right now. Check back soon!"}
              </p>
            </div>

            {debouncedSearch && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800/60 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                onClick={() => setSearchText("")}
              >
                <X className="mr-1.5 size-3.5" />
                Clear search
              </Button>
            )}
          </div>
        )}

        {/* ── Ideas grid ────────────────────────────────────────────────── */}
        {!showSkeletonGrid && !isError && underReviewIdeas.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {underReviewIdeas.map((idea) => {
              const imageUrls = normalizeImageUrls(idea?.images);
              const coverImage = pickImage(imageUrls, 0);
              const voteErrorForCard = idea?.id ? voteErrors[idea.id] : "";
              const authorName =
                idea?.author?.name || idea?.authorName || "Unknown";
              const createdAt = safeFormatDate(idea?.createdAt);
              const votes = Array.isArray(idea?.votes)
                ? (idea.votes as unknown as VoteLike[])
                : [];
              const totalVotes = votes.length;
              const upVotes = votes.reduce(
                (acc, vote) => acc + (getVoteType(vote) === "UP" ? 1 : 0),
                0,
              );
              const downVotes = votes.reduce(
                (acc, vote) => acc + (getVoteType(vote) === "DOWN" ? 1 : 0),
                0,
              );
              const purchased = isIdeaPurchasedByUser(idea, userId);

              return (
                <IdeaCardShell
                  key={idea?.id}
                  coverImage={coverImage}
                  title={idea?.title || "(Untitled idea)"}
                  problemStatement={idea?.problemStatement}
                  authorName={authorName}
                  createdAt={createdAt}
                  category={idea?.category?.name}
                  isPaid={idea?.isPaid}
                  price={
                    typeof idea?.price === "number" ? idea.price : undefined
                  }
                  footer={
                    <div className="flex flex-col gap-2">
                      {/* Vote summary strip */}
                      <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <ThumbsUp className="size-3 text-emerald-500" />
                          {upVotes}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ThumbsDown className="size-3 text-red-400" />
                          {downVotes}
                        </span>
                        <span className="ml-auto">Total: {totalVotes}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          className={cn(
                            "h-10 rounded-2xl text-sm font-semibold text-white",
                            purchased
                              ? "bg-neutral-600 hover:bg-neutral-700"
                              : "bg-emerald-600 hover:bg-emerald-700",
                          )}
                          disabled={purchaseMutation.isPending}
                          onClick={() => {
                            if (!idea?.id) return;
                            if (idea?.isPaid) {
                              if (purchased) {
                                router.push("/dashboard/purchesed-idea");
                                return;
                              }
                              purchaseMutation.mutate({ ideaId: idea.id });
                              return;
                            }
                            queryClient.setQueryData(["idea-detail", idea.id], {
                              success: true,
                              message: "ok",
                              data: idea,
                            });
                            router.push(`/idea/${idea.id}`);
                          }}
                        >
                          {idea?.isPaid
                            ? purchased
                              ? "Purchased"
                              : "Unlock"
                            : "See more"}
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-10 w-full rounded-2xl text-sm font-medium"
                              disabled={isVoting || !idea?.id}
                            >
                              Vote
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              disabled={isVoting || !idea?.id}
                              onClick={() => {
                                if (!idea?.id) return;
                                handleVote(idea, "UP");
                              }}
                            >
                              <ThumbsUp className="mr-2 size-3.5 text-emerald-500" />
                              Upvote
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={isVoting || !idea?.id}
                              onClick={() => {
                                if (!idea?.id) return;
                                handleVote(idea, "DOWN");
                              }}
                            >
                              <ThumbsDown className="mr-2 size-3.5 text-red-400" />
                              Downvote
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {voteErrorForCard ? (
                        <p className="text-xs text-destructive">
                          {voteErrorForCard}
                        </p>
                      ) : null}
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ══ PAGINATION ════════════════════════════════════════════════════ */}
      {totalPages > 1 && (
        <div className="mt-10 space-y-3">
          {showingRange && (
            <p className="text-center text-xs text-muted-foreground">
              Showing {showingRange.start}–{showingRange.end} of{" "}
              {showingRange.total} ideas
            </p>
          )}

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-2xl border bg-card px-2 py-1.5 shadow-sm">
              <Pagination>
                <PaginationContent className="gap-0.5">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-disabled={!canGoPrev}
                      className={cn(
                        "rounded-xl",
                        !canGoPrev && "pointer-events-none opacity-40",
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!canGoPrev) return;
                        setPage((p) => Math.max(1, p - 1));
                      }}
                    />
                  </PaginationItem>

                  {paginationItems.map((item, idx) => {
                    if (item === "ellipsis") {
                      return (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    const pageNumber = item;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === currentPage}
                          className={cn(
                            "rounded-xl transition-all duration-150",
                            pageNumber === currentPage &&
                              "bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white border-emerald-600",
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            if (pageNumber === currentPage) return;
                            setPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-disabled={!canGoNext}
                      className={cn(
                        "rounded-xl",
                        !canGoNext && "pointer-events-none opacity-40",
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!canGoNext) return;
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllIdeas;
