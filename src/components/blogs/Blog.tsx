"use client";
import { getBlogs, GetBlogResponse } from "@/services/blog.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LeafIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";


const PREVIEW_LENGTH = 140;

function BlogCard({ blog, index }: { blog: GetBlogResponse; index: number }) {
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

  return (
    <div
      ref={ref}
      className={cn(
        "h-full transition-all duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      )}
    >
      <Card className="group h-full flex flex-col overflow-hidden border bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-800">
        {/* Banner */}
        <div className="relative flex h-44 shrink-0 items-center justify-center bg-linear-to-br from-emerald-50 to-emerald-100 transition-all duration-300 group-hover:from-emerald-100 group-hover:to-emerald-200 dark:from-emerald-950/50 dark:to-emerald-900/30 dark:group-hover:from-emerald-900/60 dark:group-hover:to-emerald-800/40">
          <LeafIcon className="size-16 text-emerald-300 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-400 dark:text-emerald-700 dark:group-hover:text-emerald-600" />
          <div className="absolute top-3 left-3">
            <Badge className="bg-emerald-600/90 text-white backdrop-blur-sm border-0 text-xs">
              Blog
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="font-heading text-base font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {blog.title}
          </h3>

          <p className="text-sm leading-relaxed text-muted-foreground transition-all duration-300">
            {displayContent}
          </p>

          {isTruncatable && (
            <button
              onClick={() => setExpanded((p) => !p)}
              className="flex items-center gap-1 self-start text-xs font-semibold text-emerald-600 transition-all duration-200 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
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

          <div className="mt-auto flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[0.65rem] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
              {authorName.slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate">{authorName}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden animate-pulse">
      <div className="h-52 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-px bg-border mt-2" />
        <div className="flex items-center gap-2 pt-1">
          <div className="size-6 rounded-full bg-muted" />
          <div className="h-3 bg-muted rounded w-24" />
        </div>
      </div>
    </div>
  );
}

const BlogsShow = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogShow"],
    queryFn: () => getBlogs(),
  });

  const rawData = data?.data;
  const blogs: GetBlogResponse[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray((rawData as unknown as { data: GetBlogResponse[] })?.data)
      ? (rawData as unknown as { data: GetBlogResponse[] }).data
      : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative border-b bg-muted/10 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 size-80 rounded-full bg-emerald-100/50 blur-3xl dark:bg-emerald-900/20 animate-pulse" />
          <div className="absolute bottom-0 -left-10 size-60 rounded-full bg-teal-50/70 blur-2xl dark:bg-teal-900/10 animate-pulse animation-delay-300" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 text-center">
          <Badge className="mb-4 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
            <LeafIcon className="mr-1.5 size-3" />
            EcoSpark Blog
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl animate-eco-fade-up animate-delay-100">
            Stories for a{" "}
            <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-green-400">
              greener world
            </span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground animate-eco-fade-up animate-delay-200">
            Insights, stories, and ideas from the EcoSpark community on
            building a more sustainable future.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <LeafIcon className="size-12 text-emerald-200 dark:text-emerald-800" />
              <p className="text-muted-foreground">
                Could not load blogs right now. Please try again later.
              </p>
            </div>
          )}

          {!isLoading && !isError && blogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <LeafIcon className="size-12 text-emerald-200 dark:text-emerald-800" />
              <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
            </div>
          )}

          {!isLoading && blogs.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, i) => (
                <BlogCard key={blog.id ?? i} blog={blog} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogsShow;
