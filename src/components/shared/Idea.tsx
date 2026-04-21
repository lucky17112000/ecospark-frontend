"use client";

import { getIdea } from "@/services/idea.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { IIdeaResponse } from "@/types/idea.type";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
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

//!SECTIONpagination
type pageItem = number | "ellipsis";
const getPaginationItems = (currentPage: number, totalPages: number) => {
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  if (safeTotal <= 7) {
    return Array.from({ length: safeTotal }, (_, idx) => idx + 1) as pageItem[];
  }

  const items: pageItem[] = [1];

  const left = Math.max(2, safeCurrent - 1);
  const right = Math.min(safeTotal - 1, safeCurrent + 1);

  if (left > 2) items.push("ellipsis");
  for (let p = left; p <= right; p += 1) items.push(p);
  if (right < safeTotal - 1) items.push("ellipsis");

  items.push(safeTotal);
  return items;
};
//!SECTIONpagination

const DEFAULT_IDEA_IMAGE = "/window.svg";

type ImageLike = string | { url?: unknown };

type VoteLike = string | { type?: unknown };

type VoteRecordLike = {
  userId?: unknown;
  type?: unknown;
  voteType?: unknown;
};

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

const AllIdeas = ({ user }: { user?: unknown }) => {
  const [voteErrors, setVoteErrors] = useState<Record<string, string>>({});
  const [duplicateVoteDialog, setDuplicateVoteDialog] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<IIdeaResponse | null>(null);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(3);

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

  const { data } = useQuery({
    queryKey: ["idea", page, limit],
    queryFn: () => getIdea({ page, limit }),
  });
  // console.log(
  //   "Fetched ideas:",
  //   data?.data.map((idea: any) => ({
  //     vote: idea?.votes?.length,
  //     id: idea?.id,
  //   })),
  // );
  // console.log("Fetched ideas:", data?.meta);
  //!SECTION pagination
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
  //!SECTION pagination
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

    // Client-side duplicate prevention: if we can identify the current user
    // and the idea includes vote records, block duplicate requests.
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

  const underReviewIdeas = useMemo(() => {
    return ideas.filter((idea) => idea?.status === "APPROVED");
  }, [ideas]);

  const selectedImages = useMemo(() => {
    const urls = normalizeImageUrls(selectedIdea?.images);
    const coverImage = pickImage(urls, 0);
    const descriptionImage = pickImage(urls, 1);
    const solutionImage = pickImage(urls, 2);

    const usedUrls = new Set(
      [coverImage, descriptionImage, solutionImage].filter(Boolean),
    );
    const extraImages = urls.filter((url) => !usedUrls.has(url));

    return {
      urls,
      coverImage,
      descriptionImage,
      solutionImage,
      extraImages,
    };
  }, [selectedIdea]);

  return (
    <div className="w-full">
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
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              All Approved Ideas
            </h1>
            {/* <p className="text-sm text-muted-foreground">
              Showing only ideas with status APPROVED.
            </p> */}
          </div>
          <Badge variant="secondary">{underReviewIdeas.length}</Badge>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            const upVotes = votes.reduce((acc, vote) => {
              return acc + (getVoteType(vote) === "UP" ? 1 : 0);
            }, 0);
            const downVotes = votes.reduce((acc, vote) => {
              return acc + (getVoteType(vote) === "DOWN" ? 1 : 0);
            }, 0);

            return (
              <Card
                key={idea?.id}
                className={cn(
                  "h-full transition-transform duration-200 hover:-translate-y-1 hover:ring-foreground/20",
                  idea?.isPaid && "ring-destructive/20",
                )}
              >
                <div className="relative">
                  <img
                    src={coverImage}
                    alt={idea?.title || "Idea image"}
                    className="h-48 w-full bg-muted/30 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        DEFAULT_IDEA_IMAGE;
                    }}
                  />

                  {idea?.isPaid ? (
                    <div className="absolute right-3 top-3">
                      <Badge className="border-destructive/30 bg-destructive text-destructive-foreground">
                        PAID
                      </Badge>
                    </div>
                  ) : null}
                </div>

                <CardHeader className="gap-2">
                  <CardTitle className="line-clamp-2">
                    {idea?.title || "(Untitled idea)"}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium text-foreground/80">
                      {authorName}
                    </span>
                    {createdAt ? (
                      <span className="text-muted-foreground">
                        • {createdAt}
                      </span>
                    ) : null}
                  </CardDescription>

                  {idea?.category?.name ? (
                    <CardAction>
                      <Badge variant="outline">{idea.category.name}</Badge>
                    </CardAction>
                  ) : null}
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Problem Statement
                    </p>
                    <p className="mt-1 line-clamp-3 text-sm leading-relaxed">
                      {idea?.problemStatement || "—"}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="flex-col items-stretch gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                      {idea?.isPaid ? (
                        <span>
                          Paid idea
                          {typeof idea?.price === "number" ? (
                            <> • ${idea.price}</>
                          ) : null}
                        </span>
                      ) : (
                        <span>Free idea</span>
                      )}
                    </div>

                    <Button
                      variant={idea?.isPaid ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (idea?.isPaid) {
                          router.push(
                            `/payment?ideaId=${encodeURIComponent(idea?.id)}`,
                          );
                          return;
                        }
                        setSelectedIdea(idea);
                        setDrawerOpen(true);
                      }}
                    >
                      {idea?.isPaid ? "See more (Pay)" : "See more"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>Total votes: {totalVotes}</span>
                    <div className="flex items-center gap-3">
                      <span>Up: {upVotes}</span>
                      <span>Down: {downVotes}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={isVoting || !idea?.id}
                          >
                            Vote
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            disabled={isVoting || !idea?.id}
                            onClick={() => {
                              if (!idea?.id) return;
                              handleVote(idea, "UP");
                            }}
                          >
                            UP
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={isVoting || !idea?.id}
                            onClick={() => {
                              if (!idea?.id) return;
                              handleVote(idea, "DOWN");
                            }}
                          >
                            DOWN
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
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <Drawer
          open={drawerOpen}
          onOpenChange={(open) => {
            setDrawerOpen(open);
            if (!open) setSelectedIdea(null);
          }}
        >
          <DrawerContent className="outline-none data-[vaul-drawer-direction=bottom]:h-[92vh] data-[vaul-drawer-direction=bottom]:max-h-[92vh]">
            <div className="flex h-full min-h-0 flex-1 flex-col">
              <DrawerHeader className="gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <DrawerTitle className="line-clamp-2">
                      {selectedIdea?.title || "Idea Details"}
                    </DrawerTitle>
                    <DrawerDescription className="mt-1">
                      {selectedIdea?.author?.name ||
                        selectedIdea?.authorName ||
                        "Unknown"}
                      {selectedIdea?.createdAt
                        ? ` • ${safeFormatDate(selectedIdea.createdAt)}`
                        : ""}
                    </DrawerDescription>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {selectedIdea?.category?.name ? (
                      <Badge variant="outline">
                        {selectedIdea.category.name}
                      </Badge>
                    ) : null}
                    {selectedIdea?.isPaid ? (
                      <Badge className="border-destructive/30 bg-destructive text-destructive-foreground">
                        PAID
                      </Badge>
                    ) : null}

                    <DrawerClose asChild>
                      <Button variant="ghost" size="icon" aria-label="Close">
                        <X />
                      </Button>
                    </DrawerClose>
                  </div>
                </div>
              </DrawerHeader>

              <div className="px-4 pb-2">
                <img
                  src={selectedImages.coverImage}
                  alt="Idea cover"
                  className="h-56 w-full rounded-xl bg-muted/30 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      DEFAULT_IDEA_IMAGE;
                  }}
                />
              </div>

              <ScrollArea className="min-h-0 flex-1 px-4 pb-4 pr-6">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Problem Statement
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                      {selectedIdea?.problemStatement || "—"}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <img
                      src={selectedImages.descriptionImage}
                      alt="Description image"
                      className="h-52 w-full rounded-xl bg-muted/30 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          DEFAULT_IDEA_IMAGE;
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold">Description</p>
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                        {selectedIdea?.description || "—"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <img
                      src={selectedImages.solutionImage}
                      alt="Solution image"
                      className="h-52 w-full rounded-xl bg-muted/30 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          DEFAULT_IDEA_IMAGE;
                      }}
                    />
                    <div>
                      <p className="text-base font-semibold tracking-tight">
                        Solution
                      </p>
                      <div className="mt-2 rounded-xl border bg-muted/30 p-3 sm:p-4">
                        <p className="whitespace-pre-wrap wrap-break-word text-base leading-7 text-foreground">
                          {selectedIdea?.solution || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedImages.extraImages.length > 0 ? (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">More Images</p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                          {selectedImages.extraImages.map((url) => (
                            <img
                              key={url}
                              src={url}
                              alt="Idea image"
                              className="aspect-square w-full rounded-xl bg-muted/30 object-contain"
                              loading="lazy"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  DEFAULT_IDEA_IMAGE;
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </ScrollArea>

              <DrawerFooter className="flex-row items-center justify-end gap-2 border-t bg-muted/30">
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>

        {/* {underReviewIdeas.length === 0 ? (
          <div className="mt-10 rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
            No UNDER_REVIEW ideas found.
          </div>
        ) : null} */}
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
