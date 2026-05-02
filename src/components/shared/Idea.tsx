"use client";

import { getIdea } from "@/services/idea.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { IIdeaResponse } from "@/types/idea.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Search, ThumbsDown, ThumbsUp, X } from "lucide-react";
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

//!SECTIONpagination
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
//!SECTIONpagination

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

const IdeaCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-border shadow-sm">
    <Skeleton className="h-52 w-full rounded-none sm:h-56" />
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="ml-auto h-3 w-16" />
      </div>
      <Skeleton className="h-8 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-10 rounded-2xl" />
        <Skeleton className="h-10 rounded-2xl" />
      </div>
    </div>
  </div>
);

const AllIdeas = ({ user }: { user?: unknown }) => {
  const [voteErrors, setVoteErrors] = useState<Record<string, string>>({});
  const [duplicateVoteDialog, setDuplicateVoteDialog] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });
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
  const paginationItems = useMemo(() => {
    return getPaginationItems(currentPage, totalPages);
  }, [currentPage, totalPages]);
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

  const ideas = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : ([] as IIdeaResponse[]);
  }, [data]);

  const isSearching = debouncedSearch.length > 0;
  const showSkeletonGrid = isLoading || (isFetching && isSearching);

  const underReviewIdeas = useMemo(() => {
    return ideas.filter((idea) => idea?.status === "APPROVED");
  }, [ideas]);

  return (
    <div className="w-full animate-eco-fade-down animate-delay-200">
      {/* ── Search bar ─────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="relative mx-auto max-w-lg">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <AppTooltip
            side="bottom"
            content="You can search by title, problem statement, or solution."
            trigger={
              <Input
                ref={searchInputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search ideas by title, solution or problem..."
                className="h-12 rounded-2xl border-neutral-200 bg-background pl-11 pr-10 text-sm shadow-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700"
              />
            }
          />
          {searchText ? (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-800"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        {debouncedSearch ? (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Showing results for{" "}
            <span className="font-medium text-foreground">
              &ldquo;{debouncedSearch}&rdquo;
            </span>
          </p>
        ) : null}
      </div>

      <AlertDialog
        open={duplicateVoteDialog.open}
        onOpenChange={(open) => {
          setDuplicateVoteDialog((prev) => ({ ...prev, open }));
        }}
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

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h1 className="text-lg font-semibold tracking-tight">
            All Approved Ideas
          </h1>
          <Badge variant="secondary">{underReviewIdeas.length}</Badge>
        </div>

        {/* Skeleton grid */}
        {showSkeletonGrid && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit }, (_, idx) => (
              <IdeaCardSkeleton key={`idea-skeleton-${idx}`} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!showSkeletonGrid && !isError && underReviewIdeas.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card px-6 py-12 text-center shadow-sm">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
              <Search className="size-7 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold">No ideas found</p>
              <p className="text-sm text-muted-foreground">
                {debouncedSearch
                  ? `No results for "${debouncedSearch}". Try another keyword.`
                  : "There are no approved ideas to show right now."}
              </p>
            </div>
            {debouncedSearch ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setSearchText("")}
              >
                Clear search
              </Button>
            ) : null}
          </div>
        ) : null}

        {/* Ideas grid */}
        {!showSkeletonGrid && !isError && underReviewIdeas.length > 0 ? (
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
                            // Seed cache so the detail page renders instantly
                            queryClient.setQueryData(
                              ["idea-detail", idea.id],
                              { success: true, message: "ok", data: idea },
                            );
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
        ) : null}

      </div>

      {totalPages > 1 ? (
        <div className="mt-8 space-y-2">
          {showingRange ? (
            <p className="text-center text-xs text-muted-foreground">
              Showing {showingRange.start}–{showingRange.end} of{" "}
              {showingRange.total}
            </p>
          ) : null}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={!canGoPrev}
                  className={!canGoPrev ? "pointer-events-none opacity-50" : ""}
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
                  className={!canGoNext ? "pointer-events-none opacity-50" : ""}
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
      ) : null}
    </div>
  );
};

export default AllIdeas;
