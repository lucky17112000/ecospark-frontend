"use client";

import { deleteBlog, getBlogs, GetBlogResponse } from "@/services/blog.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  CalendarDays,
  ChevronDownIcon,
  ChevronUpIcon,
  LeafIcon,
  Loader2,
  Sprout,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EcoCardSkeleton } from "@/components/shared/EcoLoading";

const PREVIEW_LENGTH = 120;

// ─── Format date ──────────────────────────────────────────────────────────────

const fmtDate = (v?: string) => {
  if (!v) return null;
  const d = new Date(v);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
};

// ─── Delete blog card ─────────────────────────────────────────────────────────

function DeleteBlogCard({
  blog,
  index,
  onDelete,
  isDeleting,
}: {
  blog: GetBlogResponse;
  index: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          setTimeout(() => setVisible(true), (index % 3) * 120);
        }
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index]);

  const authorName = blog.authorName ?? blog.author?.name ?? "EcoSpark Team";
  const isTruncatable = (blog.content?.length ?? 0) > PREVIEW_LENGTH;
  const displayContent =
    !expanded && isTruncatable
      ? blog.content.slice(0, PREVIEW_LENGTH) + "…"
      : blog.content;
  const date = fmtDate(blog.createdAt);

  return (
    <div
      ref={ref}
      className={cn(
        "h-full transition-all duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      )}
    >
      <Card className="group h-full flex flex-col overflow-hidden border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/8 hover:border-emerald-200 dark:hover:border-emerald-800/60">
        {/* ── Banner ──────────────────────────────────────────────────── */}
        <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden bg-linear-to-br from-emerald-50 to-emerald-100 transition-all duration-300 group-hover:from-emerald-100 group-hover:to-emerald-200 dark:from-emerald-950/50 dark:to-emerald-900/30 dark:group-hover:from-emerald-900/60 dark:group-hover:to-emerald-800/40">
          {/* Decorative blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-full bg-emerald-200/40 blur-xl dark:bg-emerald-700/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-4 -left-4 size-16 rounded-full bg-teal-200/40 blur-lg dark:bg-teal-700/15"
          />

          <LeafIcon className="relative z-10 size-14 text-emerald-300 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-400 dark:text-emerald-700 dark:group-hover:text-emerald-600" />

          {/* Blog badge */}
          <div className="absolute left-3 top-3">
            <Badge className="border-0 bg-emerald-600/90 text-[10px] text-white backdrop-blur-sm">
              Blog
            </Badge>
          </div>

          {/* Index number */}
          <div className="absolute right-3 top-3">
            <span className="inline-flex size-6 items-center justify-center rounded-full border border-white/30 bg-white/20 text-[10px] font-bold text-emerald-700 backdrop-blur-sm dark:border-white/10 dark:bg-black/20 dark:text-emerald-400">
              {index + 1}
            </span>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <CardContent className="flex flex-1 flex-col gap-3 p-5">
          {/* Title */}
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {blog.title}
          </h3>

          {/* Content preview */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {displayContent}
          </p>

          {isTruncatable && (
            <button
              onClick={() => setExpanded((p) => !p)}
              className="flex items-center gap-1 self-start text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              {expanded ? (
                <>
                  See less <ChevronUpIcon className="size-3.5" />
                </>
              ) : (
                <>
                  See more <ChevronDownIcon className="size-3.5" />
                </>
              )}
            </button>
          )}

          {/* Author + date strip */}
          <div className="mt-auto flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[0.65rem] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
              {authorName.slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate font-medium">{authorName}</span>
            {date && (
              <>
                <span className="ml-auto flex shrink-0 items-center gap-1">
                  <CalendarDays className="size-3" />
                  {date}
                </span>
              </>
            )}
          </div>

          {/* ── Delete button ──────────────────────────────────────── */}
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => {
              if (blog.id) onDelete(blog.id);
            }}
            className={cn(
              "group/del mt-1 flex w-full items-center justify-center gap-2",
              "rounded-xl border border-red-100 bg-red-50/70 px-4 py-2.5",
              "text-sm font-semibold text-red-500",
              "transition-all duration-200 ease-out",
              "hover:border-red-200 hover:bg-red-100 hover:text-red-700 hover:shadow-sm hover:shadow-red-100",
              "active:scale-[0.98]",
              "dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400",
              "dark:hover:border-red-800/50 dark:hover:bg-red-950/40 dark:hover:text-red-300",
              isDeleting && "opacity-50 cursor-not-allowed",
            )}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4 transition-transform duration-200 group-hover/del:scale-110 group-hover/del:rotate-[-8deg]" />
            )}
            {isDeleting ? "Deleting…" : "Delete Post"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DeleteCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <EcoCardSkeleton />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const DeleteBlog = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogDelete"],
    queryFn: () => getBlogs(),
  });

  const {
    mutate: handleDelete,
    isPending: isDeleting,
    variables: deletingId,
  } = useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogDelete"] });
    },
    onError: (error: any) => {
      console.error("Delete failed:", error.message);
    },
  });

  const rawData = data?.data;
  const blogs: GetBlogResponse[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray((rawData as unknown as { data: GetBlogResponse[] })?.data)
      ? (rawData as unknown as { data: GetBlogResponse[] }).data
      : [];

  return (
    <div className="min-h-screen w-full bg-background">
      {/* ── Admin page header ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-linear-to-br from-rose-600 via-red-600 to-orange-600 px-6 py-10 sm:px-10">
        {/* Orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 left-1/3 size-40 rounded-full bg-orange-400/20 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-8 top-4 size-28 rounded-full bg-rose-300/15 blur-xl"
        />

        {/* Dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Shimmer line */}
        <div
          aria-hidden
          className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-white/30 to-transparent"
        />

        {/* Mini decorative bars */}
        <div
          aria-hidden
          className="absolute bottom-5 right-8 flex items-end gap-1.5 opacity-20"
        >
          {[8, 14, 10, 18, 12, 7].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-white"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Admin chip */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-sm">
            <Sprout className="size-3.5 text-white" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white">
              EcoSpark ·
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                <span className="flex size-10 items-center justify-center rounded-2xl border border-white/25 bg-white/20 backdrop-blur-sm">
                  <Trash2 className="size-5 text-white" />
                </span>
                Manage Blog Posts
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-red-100/80">
                Review and remove blog posts from the EcoSpark platform.
                Deletions are permanent.
              </p>
            </div>

            {/* Live count chip */}
            {!isLoading && blogs.length > 0 && (
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                <LeafIcon className="size-4 text-white/80" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-red-100/70">
                    Total Posts
                  </p>
                  <p className="text-lg font-extrabold leading-tight text-white">
                    {blogs.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Blog grid ──────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Section label */}
        {!isLoading && !isError && blogs.length > 0 && (
          <div className="mb-8 flex items-center justify-between gap-4 animate-eco-fade-up">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40">
                <Trash2 className="size-4 text-red-500 dark:text-red-400" />
              </div>
              <h2 className="text-base font-bold tracking-tight text-foreground">
                All Blog Posts
              </h2>
              <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600 ring-1 ring-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800/40">
                {blogs.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Click &quot;Delete Post&quot; to remove a blog
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <DeleteCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-red-100 bg-red-50/60 py-20 text-center dark:border-red-900/30 dark:bg-red-950/20">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="size-7 text-red-500" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                Could not load blogs
              </p>
              <p className="text-sm text-muted-foreground">
                Something went wrong. Please refresh and try again.
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-emerald-200/80 bg-linear-to-b from-emerald-50/60 to-white py-20 text-center dark:border-emerald-800/30 dark:from-emerald-950/20 dark:to-card">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200/60 animation-duration-[2s] dark:bg-emerald-800/30" />
              <div className="relative flex size-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
                <LeafIcon className="size-7 text-emerald-500" />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground">No blog posts yet</p>
              <p className="text-sm text-muted-foreground">
                There are no blogs to manage right now.
              </p>
            </div>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !isError && blogs.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, i) => (
              <DeleteBlogCard
                key={blog.id ?? i}
                blog={blog}
                index={i}
                onDelete={(id) => handleDelete(id)}
                isDeleting={isDeleting && deletingId === blog.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DeleteBlog;
