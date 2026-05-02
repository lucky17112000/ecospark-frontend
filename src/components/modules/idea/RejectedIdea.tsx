"use client";

// import { deleteIdea, getIdea } from "@/services/idea.services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { IIdeaResponse } from "@/types/idea.type";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
// import { getIdeatestvaia } from "@/services/idea.services";
import { useForm } from "@tanstack/react-form";
import { getIdea } from "@/services/idea.services";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IdeaCardShell } from "@/components/shared/IdeaCardShell";

//pagination
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
//pagination

const DEFAULT_IDEA_IMAGE = "/window.svg";

type ImageLike = string | { url?: unknown };

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

type UserLike = {
  id?: unknown;
  data?: { id?: unknown } | null;
  user?: { id?: unknown } | null;
} | null;

type FeedbackLike =
  | string
  | null
  | undefined
  | {
      message?: unknown;
      reason?: unknown;
    }
  | Array<{
      message?: unknown;
      reason?: unknown;
    }>;

const parseFeedback = (feedback: FeedbackLike) => {
  const normalizeItem = (item: unknown) => {
    if (!item || typeof item !== "object") return null;
    const asRecord = item as Record<string, unknown>;
    const maybeMessage =
      asRecord.message ?? asRecord.msg ?? asRecord.text ?? asRecord.comment;
    const maybeReason = asRecord.reason ?? asRecord.type ?? asRecord.category;
    const message = typeof maybeMessage === "string" ? maybeMessage.trim() : "";
    const reason = typeof maybeReason === "string" ? maybeReason.trim() : "";
    if (!message && !reason) return null;
    return { message, reason };
  };

  if (!feedback) return [] as Array<{ message: string; reason: string }>;

  if (Array.isArray(feedback)) {
    return feedback
      .map((item) => normalizeItem(item))
      .filter(Boolean) as Array<{ message: string; reason: string }>;
  }

  if (typeof feedback === "object") {
    const normalized = normalizeItem(feedback);
    return normalized ? [normalized] : [];
  }

  const trimmed = feedback.trim();
  if (!trimmed) return [];

  const parsed = (() => {
    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      return null;
    }
  })();

  if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => normalizeItem(item))
        .filter(Boolean) as Array<{ message: string; reason: string }>;
    }
    const normalized = normalizeItem(parsed);
    if (normalized) return [normalized];

    // Sometimes backend wraps it
    const wrapped = parsed as Record<string, unknown>;
    const maybeWrapped = wrapped.feedback ?? wrapped.feedbacks;
    if (maybeWrapped) return parseFeedback(maybeWrapped as FeedbackLike);
  }

  // Fallback: feedback is plain string
  return [{ message: trimmed, reason: "" }];
};

const RejectedIdeaPage = ({ user }: { user: UserLike }) => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<IIdeaResponse | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [openFeedbackIdeaId, setOpenFeedbackIdeaId] = useState<string | null>(
    null,
  );
  const grapIdClick = async (id: string) => {
    // await deleteIdea(id);
  };

  const userId =
    typeof user?.id === "string"
      ? user.id
      : typeof user?.data?.id === "string"
        ? user.data.id
        : typeof user?.user?.id === "string"
          ? user.user.id
          : "";

  const [page, setPage] = useState(1);
  const [limit] = useState(3);

  const { data } = useQuery({
    queryKey: ["idea", page, limit],
    queryFn: () => getIdea({ page, limit }),
  });
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

  const ideas = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : ([] as IIdeaResponse[]);
  }, [data]);

  const rejectedIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesStatus = idea?.status === "REJECTED";
      if (!matchesStatus) return false;

      // If parent passes user id, scope to that user's ideas
      if (!userId) return true;
      return idea?.authorId === userId || idea?.author?.id === userId;
    });
  }, [ideas, userId]);

  const selectedFeedback = useMemo(() => {
    return parseFeedback(selectedIdea?.feedback as FeedbackLike);
  }, [selectedIdea?.feedback]);

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
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Rejected Ideas
            </h1>
            <p className="text-sm text-muted-foreground">
              Showing only ideas with status REJECTED.
            </p>
          </div>
          <Badge variant="secondary">{rejectedIdeas.length}</Badge>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rejectedIdeas.map((idea) => {
            const imageUrls = normalizeImageUrls(idea?.images);
            const coverImage = pickImage(imageUrls, 0);

            const authorName =
              idea?.author?.name || idea?.authorName || "Unknown";
            const createdAt = safeFormatDate(idea?.createdAt);

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
                topRightBadge={
                  <span className="inline-flex items-center rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                    Rejected
                  </span>
                }
                footer={
                  <Button
                    className={cn(
                      "h-10 w-full rounded-2xl text-sm font-semibold",
                      idea?.isPaid
                        ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white",
                    )}
                    onClick={() => {
                      if (idea?.isPaid) {
                        router.push(
                          `/payment?ideaId=${encodeURIComponent(idea?.id)}`,
                        );
                        return;
                      }
                      setSelectedIdea(idea);
                      setFeedbackOpen(false);
                      setDrawerOpen(true);
                    }}
                  >
                    {idea?.isPaid ? "See more (Pay) →" : "See details →"}
                  </Button>
                }
              >
                {/* Feedback collapsible as children */}
                {(() => {
                  const feedbackItems = parseFeedback(idea?.feedback as unknown as FeedbackLike);
                  const hasFeedback = feedbackItems.length > 0;
                  const isOpen = openFeedbackIdeaId === idea?.id;
                  return (
                    <Collapsible
                      open={isOpen}
                      onOpenChange={(open) => setOpenFeedbackIdeaId(open ? idea?.id : null)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-muted-foreground">Feedback</p>
                        <CollapsibleTrigger
                          disabled={!hasFeedback}
                          className={cn(
                            "inline-flex h-7 items-center justify-center rounded-xl border px-3 text-xs font-medium transition-colors",
                            hasFeedback
                              ? "bg-muted/30 text-foreground/90 hover:bg-muted/60"
                              : "cursor-not-allowed opacity-50",
                          )}
                        >
                          {hasFeedback ? (isOpen ? "Hide" : "Show") : "No feedback"}
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="mt-2 space-y-2">
                        {feedbackItems.map((item, idx) => (
                          <div
                            key={`${idea?.id}-${idx}`}
                            className="rounded-xl border bg-muted/30 p-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-xs font-medium text-muted-foreground">Admin message</p>
                              {item.reason ? (
                                <Badge variant="outline">{item.reason}</Badge>
                              ) : null}
                            </div>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                              {item.message || "—"}
                            </p>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })()}
              </IdeaCardShell>
            );
          })}
        </div>

        <Drawer
          open={drawerOpen}
          onOpenChange={(open) => {
            setDrawerOpen(open);
            if (!open) setSelectedIdea(null);
            if (!open) setFeedbackOpen(false);
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
                  className="h-56 w-full rounded-xl object-cover"
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

                  {selectedFeedback.length > 0 ? (
                    <>
                      <Separator />
                      <Collapsible
                        open={feedbackOpen}
                        onOpenChange={setFeedbackOpen}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">Feedback</p>
                          <CollapsibleTrigger className="text-sm font-medium text-foreground/80 underline-offset-4 hover:underline">
                            {feedbackOpen
                              ? "Hide feedback"
                              : "Show feedback & reason"}
                          </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="mt-3 space-y-3">
                          {selectedFeedback.map((item, idx) => (
                            <div
                              key={`${item.message}-${item.reason}-${idx}`}
                              className="rounded-xl border bg-muted/30 p-3 sm:p-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs font-medium text-muted-foreground">
                                  Admin message
                                </p>
                                {item.reason ? (
                                  <Badge variant="outline">{item.reason}</Badge>
                                ) : null}
                              </div>
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                                {item.message || "—"}
                              </p>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </>
                  ) : null}

                  <Separator />

                  <div className="space-y-2">
                    <img
                      src={selectedImages.descriptionImage}
                      alt="Description image"
                      className="h-52 w-full rounded-xl object-cover"
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
                      className="h-52 w-full rounded-xl object-cover"
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
                              className="aspect-square w-full rounded-xl object-cover"
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

        {rejectedIdeas.length === 0 ? (
          <div className="mt-10 rounded-2xl border bg-muted/30 p-6 text-sm text-muted-foreground">
            No REJECTED ideas found.
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

export default RejectedIdeaPage;
