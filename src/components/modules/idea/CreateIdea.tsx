"use client";

import { getcategories } from "@/services/category.service";
import { createIdea } from "@/services/idea.services";
import AppField from "@/components/shared/Appfield";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createIdeaFormZodSchema,
  ICreateIdeaFormInput,
} from "@/zod/idea.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const defaultValues = {
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
  };

  const form = useForm({
    defaultValues: {
      ...defaultValues,
    },
    onSubmit: async ({ value }: any) => {
      setServerError(null);
      setServerSuccess(null);
      try {
        const result = (await mutateAsync(value)) as any;
        if (!result.success) {
          setServerError(result.message || "Failed to create idea.");
          return;
        }

        setServerSuccess(result.message || "Idea created successfully.");

        // Small delay so the user can see the success message.
        setTimeout(() => {
          router.push("/dashboard/under-review-idea");
        }, 600);
      } catch (error) {
        setServerError((error as Error)?.message || "Failed to create idea.");
      }
    },
  });
  return (
    <form
      method="POST"
      action="#"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit().catch((error: any) => {
          console.error("Form submit failed:", error);
          setServerError(error?.message || "Failed to create idea.");
        });
      }}
      className="space-y-5"
    >
      <form.Field
        name="title"
        validators={{ onChange: createIdeaFormZodSchema.shape.title }}
      >
        {(field) => (
          <AppField
            field={field}
            label="Title"
            placeholder="Enter idea title"
          />
        )}
      </form.Field>

      <form.Field
        name="problemStatement"
        validators={{
          onChange: createIdeaFormZodSchema.shape.problemStatement,
        }}
      >
        {(field) => {
          const firstError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0
              ? String(field.state.meta.errors[0])
              : "";

          return (
            <div className="space-y-1.5">
              <Label
                htmlFor={field.name}
                className={firstError ? "text-destructive" : ""}
              >
                Problem Statement
              </Label>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Write the problem statement"
                aria-invalid={!!firstError}
              />
              {firstError ? (
                <p className="text-sm text-destructive">{firstError}</p>
              ) : null}
            </div>
          );
        }}
      </form.Field>

      <div className="space-y-4">
        <form.Field
          name="solution"
          validators={{ onChange: createIdeaFormZodSchema.shape.solution }}
        >
          {(field) => {
            const firstError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0
                ? String(field.state.meta.errors[0])
                : "";

            return (
              <div className="space-y-1.5">
                <Label
                  htmlFor={field.name}
                  className={firstError ? "text-destructive" : ""}
                >
                  Solution
                </Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Write the solution"
                  aria-invalid={!!firstError}
                />
                {firstError ? (
                  <p className="text-sm text-destructive">{firstError}</p>
                ) : null}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="solutionImage">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Solution Photo (optional)</Label>
              <input
                id={field.name}
                name={field.name}
                type="file"
                accept="image/*"
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.files?.[0] ?? null)
                }
              />
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-4">
        <form.Field
          name="description"
          validators={{
            onChange: createIdeaFormZodSchema.shape.description,
          }}
        >
          {(field) => {
            const firstError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0
                ? String(field.state.meta.errors[0])
                : "";

            return (
              <div className="space-y-1.5">
                <Label
                  htmlFor={field.name}
                  className={firstError ? "text-destructive" : ""}
                >
                  Description
                </Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Write the full description"
                  aria-invalid={!!firstError}
                />
                {firstError ? (
                  <p className="text-sm text-destructive">{firstError}</p>
                ) : null}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="descriptionImage">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Description Photo (optional)</Label>
              <input
                id={field.name}
                name={field.name}
                type="file"
                accept="image/*"
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.files?.[0] ?? null)
                }
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="images">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>More Photos (optional)</Label>
            <input
              id={field.name}
              name={field.name}
              type="file"
              accept="image/*"
              multiple
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(Array.from(e.target.files ?? []))
              }
            />
          </div>
        )}
      </form.Field>

      <form.Field
        name="categoryId"
        validators={{ onChange: createIdeaFormZodSchema.shape.categoryId }}
      >
        {(field) => {
          const firstError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0
              ? String(field.state.meta.errors[0])
              : "";

          return (
            <div className="space-y-1.5">
              <Label
                htmlFor={field.name}
                className={firstError ? "text-destructive" : ""}
              >
                Category
              </Label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
                aria-invalid={!!firstError}
              >
                <option value="">Select a category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {firstError ? (
                <p className="text-sm text-destructive">{firstError}</p>
              ) : null}
            </div>
          );
        }}
      </form.Field>

      <form.Field name="price">
        {(field) => (
          <AppField
            field={field}
            label="Price (optional)"
            type="number"
            placeholder="IF it is free to implement, enter 0"
          />
        )}
      </form.Field>

      {serverError ? (
        <Alert className="border border-neutral-200 bg-neutral-50 rounded-xl py-3 px-4">
          <AlertDescription className="text-sm text-red-600">
            {serverError}
          </AlertDescription>
        </Alert>
      ) : null}

      {serverSuccess ? (
        <Alert className="border border-neutral-200 bg-neutral-50 rounded-xl py-3 px-4">
          <AlertDescription className="text-sm text-emerald-700">
            {serverSuccess}
          </AlertDescription>
        </Alert>
      ) : null}

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <AppSubmitButton
            isPending={isSubmitting}
            disabled={!canSubmit}
            classname="w-full"
            pendingLabel="Creating..."
          >
            Create Idea
          </AppSubmitButton>
        )}
      </form.Subscribe>
    </form>
  );
};

export default CreateIdeaPage;
