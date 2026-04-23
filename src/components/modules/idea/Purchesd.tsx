"use client";
import { getUserPurchases } from "@/services/purchase.service";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const DEFAULT_IDEA_IMAGE = "/window.svg";

type ImageLike = string | { url?: unknown };

type PurchaseRecordLike = {
  id?: unknown;
  paymentStatus?: unknown;
  createdAt?: unknown;
  idea?: unknown;
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

const Purchesd = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<IIdeaResponse | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["purchasedIdeas"],
    queryFn: () => getUserPurchases(),
  });

  const purchases = useMemo(() => {
    const maybeArray = data?.data;
    return Array.isArray(maybeArray)
      ? (maybeArray as PurchaseRecordLike[])
      : ([] as PurchaseRecordLike[]);
  }, [data]);

  const purchasedIdeas = useMemo(() => {
    return purchases
      .map((purchase) => {
        const idea = (purchase?.idea as IIdeaResponse | undefined) ?? undefined;
        if (!idea || typeof idea !== "object") return null;
        return {
          purchase,
          idea,
        };
      })
      .filter(Boolean) as {
      purchase: PurchaseRecordLike;
      idea: IIdeaResponse;
    }[];
  }, [purchases]);

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
              Purchased Ideas
            </h1>
            <p className="text-sm text-muted-foreground">
              Your purchased ideas will appear here.
            </p>
          </div>
          <Badge variant="secondary">{purchasedIdeas.length}</Badge>
        </div>

        {isLoading ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="h-full">
                <Skeleton className="h-48 w-full rounded-md" />
                <CardHeader className="gap-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-11/12" />
                </CardContent>
                <CardFooter className="justify-end">
                  <Skeleton className="h-9 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="mt-6 rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
            Failed to load purchased ideas.
          </div>
        ) : purchasedIdeas.length === 0 ? (
          <div className="mt-6 rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
            No purchased ideas found.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {purchasedIdeas.map(({ purchase, idea }) => {
              const imageUrls = normalizeImageUrls(idea?.images);
              const coverImage = pickImage(imageUrls, 0);

              const authorName =
                idea?.author?.name || idea?.authorName || "Unknown";
              const createdAt = safeFormatDate(idea?.createdAt);
              const purchasedAt = safeFormatDate(purchase?.createdAt);
              const paymentStatus =
                purchase?.paymentStatus === "PAID"
                  ? "PAID"
                  : purchase?.paymentStatus === "UNPAID"
                    ? "UNPAID"
                    : null;

              return (
                <Card
                  key={typeof purchase?.id === "string" ? purchase.id : idea.id}
                  className={cn(
                    "h-full transition-transform duration-200 hover:-translate-y-1 hover:ring-foreground/20",
                    idea?.isPaid && "ring-destructive/20",
                  )}
                >
                  <div className="relative">
                    <img
                      src={coverImage}
                      alt={idea?.title || "Idea image"}
                      className="h-48 w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          DEFAULT_IDEA_IMAGE;
                      }}
                    />

                    <div className="absolute right-3 top-3 flex items-center gap-2">
                      {paymentStatus ? (
                        paymentStatus === "PAID" ? (
                          <Badge variant="secondary">PAID</Badge>
                        ) : (
                          <Badge className="border-destructive/30 bg-destructive text-destructive-foreground">
                            UNPAID
                          </Badge>
                        )
                      ) : null}

                      {idea?.isPaid ? (
                        <Badge className="border-destructive/30 bg-destructive text-destructive-foreground">
                          PAID IDEA
                        </Badge>
                      ) : (
                        <Badge variant="secondary">FREE</Badge>
                      )}
                    </div>
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

                  <CardFooter className="justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                      {purchasedAt ? (
                        <span>Purchased • {purchasedAt}</span>
                      ) : null}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedIdea(idea);
                        setDrawerOpen(true);
                      }}
                    >
                      See more
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

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
      </div>
    </div>
  );
};

export default Purchesd;
