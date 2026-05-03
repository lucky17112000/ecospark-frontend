"use client";

import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBlog } from "@/services/blog.service";
import { createBlogZodSchema, ICreateBlogPayload } from "@/zod/blog.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { StyledTextarea } from "../../idea/CreateIdea";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import {
  AlertCircleIcon,
  BookOpen,
  CheckCircle2Icon,
  Feather,
  Hash,
  Leaf,
  Lightbulb,
  Send,
  Sprout,
  Type,
  User,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Writing tips ─────────────────────────────────────────────────────────────

const TIPS = [
  {
    icon: Lightbulb,
    title: "Be specific",
    desc: "Focus on one eco topic — solar energy, waste reduction, green transport.",
  },
  {
    icon: Leaf,
    title: "Use data",
    desc: "Back your insights with stats or research to boost credibility.",
  },
  {
    icon: BookOpen,
    title: "Tell a story",
    desc: "Personal or community stories make eco content relatable and shareable.",
  },
  {
    icon: Hash,
    title: "Clear structure",
    desc: "Use an intro, body, and conclusion to guide readers effortlessly.",
  },
];

// ─── Section label ────────────────────────────────────────────────────────────

function FieldLabel({
  htmlFor,
  icon: Icon,
  label,
  required,
  hasError,
  hint,
}: {
  htmlFor: string;
  icon: React.ElementType;
  label: string;
  required?: boolean;
  hasError?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label
        htmlFor={htmlFor}
        className={cn(
          "flex items-center gap-2 text-sm font-semibold",
          hasError ? "text-destructive" : "text-foreground",
        )}
      >
        <span className="flex size-6 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
          <Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        </span>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        )}
      </Label>
      {hint && (
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const CreateBlog = ({ userInfo }: { userInfo: any }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: (payload: ICreateBlogPayload) => createBlog(payload),
  });

  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      authorId: userInfo?.id || "",
    },
    onSubmit: async ({ value }: any) => {
      setServerError(null);
      setServerSuccess(null);
      try {
        const payload = { ...value, authorId: userInfo?.id || "" };
        const result = await mutateAsync(payload);
        if (!result.success) {
          setServerError(result.message || "Failed to create the blog.");
          return;
        }
        setServerSuccess("Blog created successfully!");
        setTimeout(() => router.push("/blog"), 600);
      } catch (error: any) {
        setServerError(
          error.message || "An error occurred while creating the blog.",
        );
      }
    },
  });

  const authorName = userInfo?.name || "Author";
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen w-full">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-700 px-6 py-10 sm:px-10">
        {/* Decorative orbs */}
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-10 left-1/3 size-40 rounded-full bg-teal-400/20 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -left-8 top-4 size-32 rounded-full bg-emerald-300/15 blur-2xl" />

        {/* Dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Shimmer top line */}
        <div aria-hidden className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-white/35 to-transparent" />

        {/* Mini bar decorations */}
        <div aria-hidden className="absolute bottom-5 right-8 flex items-end gap-1.5 opacity-20">
          {[10, 16, 12, 20, 14, 8].map((h, i) => (
            <div key={i} className="w-1 rounded-full bg-white" style={{ height: `${h}px` }} />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          {/* EcoSpark chip */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-sm">
            <Sprout className="size-3.5 text-white" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white">
              EcoSpark · Admin
            </span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                <span className="flex size-10 items-center justify-center rounded-2xl border border-white/25 bg-white/20 backdrop-blur-sm">
                  <Feather className="size-5 text-white" />
                </span>
                Create a Blog Post
              </h1>
              <p className="max-w-lg text-sm text-emerald-100/80 leading-relaxed">
                Share your sustainability insights, stories, and ideas with the EcoSpark community.
              </p>
            </div>

            {/* Author chip */}
            <div className="hidden items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm sm:flex">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-bold text-white">
                {authorInitial}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100/70">
                  Author
                </p>
                <p className="text-sm font-bold text-white leading-tight">{authorName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Form (2/3 width) ────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="animate-eco-fade-up overflow-hidden rounded-3xl border bg-card shadow-lg shadow-black/5 dark:shadow-black/20">

              {/* Card header strip */}
              <div className="flex items-center gap-3 border-b bg-muted/30 px-6 py-4">
                <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                  <Feather className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Blog Editor</p>
                  <p className="text-[11px] text-muted-foreground">Fill in the details below</p>
                </div>

                {/* Mobile author chip */}
                <div className="ml-auto flex items-center gap-2 sm:hidden">
                  <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    {authorInitial}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{authorName}</span>
                </div>
              </div>

              {/* Form body */}
              <div className="px-6 py-7 sm:px-8 sm:py-8">
                <form
                  method="POST"
                  action="#"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit().catch((error: any) => {
                      setServerError(error?.message || "Failed to create blog.");
                    });
                  }}
                  className="space-y-6"
                >
                  {/* Title field */}
                  <form.Field
                    name="title"
                    validators={{ onChange: createBlogZodSchema.shape.title }}
                  >
                    {(field) => {
                      const err =
                        field.state.meta.isTouched && field.state.meta.errors.length > 0
                          ? String(field.state.meta.errors[0])
                          : "";
                      const charCount = (field.state.value ?? "").length;
                      const isNearLimit = charCount > 160;

                      return (
                        <div className="animate-eco-fade-up animate-delay-100 space-y-2">
                          <FieldLabel
                            htmlFor={field.name}
                            icon={Type}
                            label="Blog Title"
                            required
                            hasError={!!err}
                            hint={`${charCount}/200`}
                          />
                          <div className="group relative">
                            {/* Green glow on focus */}
                            <div className="absolute -inset-px rounded-xl bg-linear-to-r from-emerald-400 to-teal-400 opacity-0 blur-sm transition-all duration-300 group-focus-within:opacity-30" />
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              placeholder="e.g. How Solar Panels Are Changing Rural Communities"
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={cn(
                                "relative h-11 rounded-xl border transition-all duration-200",
                                "focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20",
                                "dark:focus:border-emerald-700/60 dark:focus:ring-emerald-600/20",
                                err && "border-destructive focus-visible:ring-destructive/20",
                              )}
                            />
                          </div>
                          {/* Char count bar */}
                          {charCount > 0 && (
                            <div className="h-0.5 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-300",
                                  isNearLimit ? "bg-amber-400" : "bg-emerald-400",
                                )}
                                style={{ width: `${Math.min(100, (charCount / 200) * 100)}%` }}
                              />
                            </div>
                          )}
                          {err && <FieldError>{err}</FieldError>}
                        </div>
                      );
                    }}
                  </form.Field>

                  {/* Content field */}
                  <form.Field
                    name="content"
                    validators={{ onChange: createBlogZodSchema.shape.content }}
                  >
                    {(field) => {
                      const err =
                        field.state.meta.isTouched && field.state.meta.errors.length > 0
                          ? String(field.state.meta.errors[0])
                          : "";
                      const wordCount = (field.state.value ?? "")
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean).length;

                      return (
                        <div className="animate-eco-fade-up animate-delay-200 space-y-2">
                          <FieldLabel
                            htmlFor={field.name}
                            icon={BookOpen}
                            label="Blog Content"
                            required
                            hasError={!!err}
                            hint={wordCount > 0 ? `${wordCount} word${wordCount !== 1 ? "s" : ""}` : undefined}
                          />
                          <div className="group relative">
                            <div className="absolute -inset-px rounded-xl bg-linear-to-r from-emerald-400 to-teal-400 opacity-0 blur-sm transition-all duration-300 group-focus-within:opacity-30" />
                            <StyledTextarea
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              placeholder="Share your eco insights, experiences, or solutions. What environmental problem does your blog address? How can readers take action?"
                              rows={10}
                              hasError={!!err}
                              onBlur={field.handleBlur}
                              onChange={field.handleChange}
                            />
                          </div>
                          {err && <FieldError>{err}</FieldError>}
                        </div>
                      );
                    }}
                  </form.Field>

                  {/* Server error */}
                  {serverError && (
                    <Alert className="animate-eco-fade-in rounded-2xl border-red-100 bg-red-50/80 dark:border-red-900/30 dark:bg-red-950/20">
                      <AlertCircleIcon className="size-4 text-red-500" />
                      <AlertDescription className="text-sm text-red-600 dark:text-red-400">
                        {serverError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Server success */}
                  {serverSuccess && (
                    <Alert className="animate-eco-fade-in rounded-2xl border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                      <CheckCircle2Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <AlertDescription className="text-sm text-emerald-700 dark:text-emerald-300">
                        {serverSuccess}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit */}
                  <form.Subscribe
                    selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                  >
                    {([canSubmit, isSubmitting]) => (
                      <div className="animate-eco-fade-up animate-delay-300 pt-1">
                        <AppSubmitButton
                          isPending={isSubmitting}
                          disabled={!canSubmit}
                          pendingLabel="Publishing blog post…"
                          classname={cn(
                            "w-full h-12 rounded-2xl",
                            "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800",
                            "text-white text-sm font-semibold tracking-wide",
                            "shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35",
                            "transition-all duration-200",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                          )}
                        >
                          <Send className="mr-2 size-4" />
                          Publish Blog Post
                        </AppSubmitButton>
                      </div>
                    )}
                  </form.Subscribe>
                </form>
              </div>
            </div>
          </div>

          {/* ── Sidebar tips (1/3 width) ────────────────────────────────── */}
          <div className="space-y-5 animate-eco-fade-up animate-delay-200">

            {/* Author info card */}
            <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
              <div className="bg-linear-to-br from-emerald-500 to-teal-600 px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-100/70">
                  Publishing as
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-white/20 text-base font-extrabold text-white backdrop-blur-sm">
                    {authorInitial}
                  </div>
                  <div>
                    <p className="font-bold text-white leading-tight">{authorName}</p>
                    <p className="text-xs text-emerald-100/70 capitalize">
                      {userInfo?.role?.toLowerCase().replace("_", " ") || "admin"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t bg-muted/20 px-5 py-3">
                <User className="size-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">
                  {userInfo?.email || ""}
                </span>
              </div>
            </div>

            {/* Writing tips card */}
            <div className="rounded-3xl border bg-card shadow-sm overflow-hidden">
              <div className="border-b bg-muted/30 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                    <Lightbulb className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Writing Tips</p>
                </div>
              </div>

              <div className="divide-y px-5">
                {TIPS.map(({ icon: Icon, title, desc }, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-3 py-4 animate-eco-fade-up",
                      `animate-delay-${(i + 3) * 100}`,
                    )}
                  >
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                      <Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick checklist */}
            <div className="rounded-3xl border bg-linear-to-br from-emerald-50/80 to-teal-50/60 px-5 py-5 dark:border-emerald-900/30 dark:from-emerald-950/30 dark:to-teal-950/20">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Before you publish
              </p>
              <ul className="space-y-2">
                {[
                  "Title is clear and descriptive",
                  "Content is well-structured",
                  "Eco impact is communicated",
                  "Grammar and spelling checked",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-emerald-300/60 bg-white dark:border-emerald-800/60 dark:bg-emerald-950/40">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
