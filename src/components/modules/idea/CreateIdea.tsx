"use client";

import { getcategories } from "@/services/category.service";
import { createIdea } from "@/services/idea.services";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createIdeaFormZodSchema,
  ICreateIdeaFormInput,
} from "@/zod/idea.validation";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ImageIcon,
  InfoIcon,
  LeafIcon,
  SendIcon,
  TagIcon,
  UploadCloudIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ─── Helper sub-components ────────────────────────────────────────────────────

const SectionCard = ({
  step,
  title,
  description,
  children,
  className,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-2xl border bg-card p-5 sm:p-6 transition-shadow duration-200 hover:shadow-sm",
      className,
    )}
  >
    {/* Section header */}
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-sm">
        {step}
      </span>
      <div>
        <h3 className="text-sm font-semibold leading-none">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
    {children}
  </div>
);

const FieldError = ({ message }: { message: string }) =>
  message ? (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
      <AlertCircleIcon className="h-3 w-3 shrink-0" />
      {message}
    </p>
  ) : null;

const StyledTextarea = ({
  id,
  name,
  value,
  placeholder,
  rows = 4,
  hasError,
  onBlur,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  rows?: number;
  hasError: boolean;
  onBlur: () => void;
  onChange: (v: string) => void;
}) => (
  <Textarea
    id={id}
    name={name}
    value={value}
    placeholder={placeholder}
    rows={rows}
    aria-invalid={hasError}
    onBlur={onBlur}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "resize-none leading-relaxed",
      hasError && "border-destructive focus-visible:ring-destructive/20",
    )}
  />
);

const FileUploadZone = ({
  id,
  label,
  hint,
  accept = "image/*",
  multiple = false,
  onBlur,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  onBlur?: () => void;
  onChange: (files: FileList | null) => void;
}) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const hasFiles = fileNames.length > 0;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <label
        htmlFor={id}
        className={cn(
          "group flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl",
          "border-2 border-dashed px-4 py-6 text-center",
          "transition-all duration-200 ease-out",
          hasFiles
            ? "border-emerald-400/70 bg-emerald-50/30 dark:border-emerald-700/60 dark:bg-emerald-950/20"
            : [
                "border-border bg-muted/20",
                "hover:border-emerald-400 hover:bg-emerald-50/30",
                "dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20",
              ],
        )}
      >
        {hasFiles ? (
          <ImageIcon className="h-7 w-7 text-emerald-500" />
        ) : (
          <UploadCloudIcon className="h-7 w-7 text-muted-foreground transition-colors duration-200 group-hover:text-emerald-500" />
        )}

        <div>
          {hasFiles ? (
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {fileNames.length === 1
                ? fileNames[0]
                : `${fileNames.length} files selected`}
            </p>
          ) : (
            <>
              <p className="text-sm font-medium">Click to upload</p>
              {hint && (
                <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
              )}
            </>
          )}
        </div>

        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onBlur={onBlur}
          onChange={(e) => {
            const files = e.target.files;
            setFileNames(files ? Array.from(files).map((f) => f.name) : []);
            onChange(files);
          }}
        />
      </label>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CreateIdeaPage = ({ id }: { id: string }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const router = useRouter();

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: getcategories,
  });

  const { mutateAsync } = useMutation({
    mutationFn: (payload: ICreateIdeaFormInput) => createIdea(payload),
  });

  const categories = categoriesResponse?.data ?? [];

  const form = useForm({
    defaultValues: {
      title: "",
      problemStatement: "",
      solution: "",
      description: "",
      categoryId: "",
      authorId: id,
      price: "",
      descriptionImage: null as File | null,
      solutionImage: null as File | null,
      images: [] as File[],
    },
    onSubmit: async ({ value }: any) => {
      setServerError(null);
      setServerSuccess(null);
      try {
        // Default to price=1 when the user leaves the field empty
        const payload = { ...value, price: value.price ?? 1 };
        const result = (await mutateAsync(payload as any)) as any;

        if (!result.success) {
          setServerError(result.message || "Failed to create idea.");
          return;
        }

        setServerSuccess(result.message || "Idea created successfully.");
        setTimeout(() => router.push("/dashboard/under-review-idea"), 600);
      } catch (error) {
        setServerError((error as Error)?.message || "Failed to create idea.");
      }
    },
  });

  return (
    <div className="mx-auto w-full max-w-3xl animate-eco-fade-up space-y-2">
      {/* ── Page header ── */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25">
          <LeafIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Create New Idea
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your sustainability idea with the EcoSpark community.
          </p>
        </div>
      </div>

      <form
        method="POST"
        action="#"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit().catch((error: any) => {
            setServerError(error?.message || "Failed to create idea.");
          });
        }}
        className="space-y-4"
      >
        {/* ── 1 · Basic Info ── */}
        <SectionCard
          step={1}
          title="Basic Information"
          description="Give your idea a clear title and pick the right category."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <form.Field
              name="title"
              validators={{ onChange: createIdeaFormZodSchema.shape.title }}
            >
              {(field) => {
                const err =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? String(field.state.meta.errors[0])
                    : "";
                return (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className={err ? "text-destructive" : ""}
                    >
                      Title{" "}
                      <span className="text-destructive" aria-hidden>
                        *
                      </span>
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Solar-Powered Community Garden"
                      aria-invalid={!!err}
                      className={err ? "border-destructive" : ""}
                    />
                    <FieldError message={err} />
                  </div>
                );
              }}
            </form.Field>

            {/* Category */}
            <form.Field
              name="categoryId"
              validators={{
                onChange: createIdeaFormZodSchema.shape.categoryId,
              }}
            >
              {(field) => {
                const err =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? String(field.state.meta.errors[0])
                    : "";
                return (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className={err ? "text-destructive" : ""}
                    >
                      Category{" "}
                      <span className="text-destructive" aria-hidden>
                        *
                      </span>
                    </Label>
                    <div className="relative">
                      <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={!!err}
                        className={cn(
                          "h-10 w-full appearance-none rounded-lg border border-input bg-background pl-9 pr-3 text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          "transition-colors duration-150",
                          err && "border-destructive",
                          !field.state.value && "text-muted-foreground",
                        )}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <FieldError message={err} />
                  </div>
                );
              }}
            </form.Field>
          </div>
        </SectionCard>

        {/* ── 2 · Problem & Solution ── */}
        <SectionCard
          step={2}
          title="Problem & Solution"
          description="Describe the environmental issue and how your idea addresses it."
        >
          <div className="space-y-4">
            {/* Problem Statement */}
            <form.Field
              name="problemStatement"
              validators={{
                onChange: createIdeaFormZodSchema.shape.problemStatement,
              }}
            >
              {(field) => {
                const err =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? String(field.state.meta.errors[0])
                    : "";
                return (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className={err ? "text-destructive" : ""}
                    >
                      Problem Statement{" "}
                      <span className="text-destructive" aria-hidden>
                        *
                      </span>
                    </Label>
                    <StyledTextarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder="What environmental problem does your idea address?"
                      rows={4}
                      hasError={!!err}
                      onBlur={field.handleBlur}
                      onChange={field.handleChange}
                    />
                    <FieldError message={err} />
                  </div>
                );
              }}
            </form.Field>

            {/* Solution */}
            <form.Field
              name="solution"
              validators={{ onChange: createIdeaFormZodSchema.shape.solution }}
            >
              {(field) => {
                const err =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? String(field.state.meta.errors[0])
                    : "";
                return (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className={err ? "text-destructive" : ""}
                    >
                      Solution{" "}
                      <span className="text-destructive" aria-hidden>
                        *
                      </span>
                    </Label>
                    <StyledTextarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder="How does your idea solve the problem?"
                      rows={4}
                      hasError={!!err}
                      onBlur={field.handleBlur}
                      onChange={field.handleChange}
                    />
                    <FieldError message={err} />
                  </div>
                );
              }}
            </form.Field>

            {/* Solution image */}
            <form.Field name="solutionImage">
              {(field) => (
                <FileUploadZone
                  id={field.name}
                  label="Solution Photo (optional)"
                  hint="PNG, JPG or WEBP — up to 10 MB"
                  onBlur={field.handleBlur}
                  onChange={(files) => field.handleChange(files?.[0] ?? null)}
                />
              )}
            </form.Field>
          </div>
        </SectionCard>

        {/* ── 3 · Description ── */}
        <SectionCard
          step={3}
          title="Full Description"
          description="Provide in-depth details — goals, implementation steps, expected impact."
        >
          <div className="space-y-4">
            <form.Field
              name="description"
              validators={{
                onChange: createIdeaFormZodSchema.shape.description,
              }}
            >
              {(field) => {
                const err =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? String(field.state.meta.errors[0])
                    : "";
                return (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className={err ? "text-destructive" : ""}
                    >
                      Description{" "}
                      <span className="text-destructive" aria-hidden>
                        *
                      </span>
                    </Label>
                    <StyledTextarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder="Write a detailed description of your idea…"
                      rows={6}
                      hasError={!!err}
                      onBlur={field.handleBlur}
                      onChange={field.handleChange}
                    />
                    <FieldError message={err} />
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="descriptionImage">
              {(field) => (
                <FileUploadZone
                  id={field.name}
                  label="Description Photo (optional)"
                  hint="PNG, JPG or WEBP — up to 10 MB"
                  onBlur={field.handleBlur}
                  onChange={(files) => field.handleChange(files?.[0] ?? null)}
                />
              )}
            </form.Field>
          </div>
        </SectionCard>

        {/* ── 4 · Gallery ── */}
        <SectionCard
          step={4}
          title="Gallery"
          description="Upload extra images to make your idea more compelling."
        >
          <form.Field name="images">
            {(field) => (
              <FileUploadZone
                id={field.name}
                label="Additional Photos (optional)"
                hint="Select multiple images at once"
                multiple
                onBlur={field.handleBlur}
                onChange={(files) =>
                  field.handleChange(Array.from(files ?? []))
                }
              />
            )}
          </form.Field>
        </SectionCard>

        {/* ── 5 · Pricing ── */}
        <SectionCard
          step={5}
          title="Pricing"
          description="Set a price for community members to purchase and support your idea."
        >
          {/* Info callout */}
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">
              Leave blank to use the default price of{" "}
              <strong className="font-semibold">$1</strong>. Enter any positive
              number to set a custom price for your idea.
            </p>
          </div>

          <form.Field name="price">
            {(field) => {
              const err =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0
                  ? String(field.state.meta.errors[0])
                  : "";
              return (
                <div className="space-y-1.5">
                  <Label
                    htmlFor={field.name}
                    className={err ? "text-destructive" : ""}
                  >
                    Price{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (optional — defaults to $1)
                    </span>
                  </Label>
                  <div className="relative max-w-xs">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      $
                    </span>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Leave blank for default ($1)"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!!err}
                      className={cn(
                        "pl-7",
                        err &&
                          "border-destructive focus-visible:ring-destructive/20",
                      )}
                    />
                  </div>
                  <FieldError message={err} />
                </div>
              );
            }}
          </form.Field>
        </SectionCard>

        {/* ── Server feedback ── */}
        {serverError && (
          <Alert className="rounded-xl border-destructive/30 bg-destructive/5 animate-eco-fade-in">
            <AlertCircleIcon className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-sm text-destructive">
              {serverError}
            </AlertDescription>
          </Alert>
        )}

        {serverSuccess && (
          <Alert className="rounded-xl border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30 animate-eco-fade-in">
            <CheckCircle2Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-sm text-emerald-700 dark:text-emerald-300">
              {serverSuccess}
            </AlertDescription>
          </Alert>
        )}

        {/* ── Submit ── */}
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <AppSubmitButton
              isPending={isSubmitting}
              disabled={!canSubmit}
              classname="w-full h-11 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all duration-200"
              pendingLabel="Submitting your idea…"
            >
              <SendIcon className="mr-2 h-4 w-4" />
              Submit Idea
            </AppSubmitButton>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default CreateIdeaPage;
