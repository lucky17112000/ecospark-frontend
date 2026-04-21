"use client";

// import { deleteIdea, getIdea } from "@/services/idea.services";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
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

  const { data } = useQuery({
    queryKey: ["idea"],
    queryFn: getIdea,
  });
  // console.log("Fetched ideas data:", data?.data);
  // const { data: deleteIdeaData } = useQuery({
  //   queryKey: ["deleteIdea"],
  //   queryFn: deleteIdea,
  // });

  // const { mutateAsync: deleteIdeaMutate } = useMutation({
  //   mutationFn: (id: string) => deleteIdea(id),
  // });
  // const handleDelete = async (id: string) => {
  //   console.log("author id:", id);
  //   console.log("User ID for deletion:", userId);

  //   try {
  //     await deleteIdeaMutate(id);
  //   } catch (error) {
  //     console.error("Error deleting idea:", error);
  //   }
  // };

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

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rejectedIdeas.map((idea) => {
            const imageUrls = normalizeImageUrls(idea?.images);
            const coverImage = pickImage(imageUrls, 0);

            const authorName =
              idea?.author?.name || idea?.authorName || "Unknown";
            const createdAt = safeFormatDate(idea?.createdAt);

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
                    className="h-48 w-full object-cover transition-transform duration-300 ease-out group-hover/card:scale-105"
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

                  {(() => {
                    const feedbackItems = parseFeedback(
                      idea?.feedback as unknown as FeedbackLike,
                    );
                    const hasFeedback = feedbackItems.length > 0;
                    const isOpen = openFeedbackIdeaId === idea?.id;

                    return (
                      <Collapsible
                        open={isOpen}
                        onOpenChange={(open) =>
                          setOpenFeedbackIdeaId(open ? idea?.id : null)
                        }
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-medium text-muted-foreground">
                            Feedback
                          </p>
                          <CollapsibleTrigger
                            disabled={!hasFeedback}
                            className={cn(
                              "inline-flex h-7 items-center justify-center rounded-md border px-2 text-xs font-medium",
                              hasFeedback
                                ? "bg-muted/30 text-foreground/90 hover:bg-muted/50"
                                : "cursor-not-allowed opacity-60",
                            )}
                          >
                            {hasFeedback
                              ? isOpen
                                ? "Hide"
                                : "Show"
                              : "No feedback"}
                          </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="mt-2 space-y-2">
                          {hasFeedback ? (
                            feedbackItems.map((item, idx) => (
                              <div
                                key={`${idea?.id}-${idx}`}
                                className="rounded-xl border bg-muted/30 p-3"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-xs font-medium text-muted-foreground">
                                    Admin message
                                  </p>
                                  {item.reason ? (
                                    <Badge variant="outline">
                                      {item.reason}
                                    </Badge>
                                  ) : null}
                                </div>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                                  {item.message || "—"}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground">
                              No feedback has been added for this idea yet.
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })()}
                </CardContent>

                <CardFooter className="justify-between gap-3">
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
                      setFeedbackOpen(false);
                      setDrawerOpen(true);
                    }}
                  >
                    {idea?.isPaid ? "See more (Pay)" : "See more"}
                  </Button>
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
          <div className="mt-10 rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
            No REJECTED ideas found.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RejectedIdeaPage;
