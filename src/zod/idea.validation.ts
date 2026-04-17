import { z } from "zod";

export const createIdeaPayloadZodSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(150, { message: "Title must be less than 150 characters" }),
  problemStatement: z
    .string()
    .min(1, { message: "Problem statement is required" })
    .max(5000, { message: "Problem statement is too long" }),
  solution: z
    .string()
    .min(1, { message: "Solution is required" })
    .max(5000, { message: "Solution is too long" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(10000, { message: "Description is too long" }),

  categoryId: z.string().uuid({ message: "Invalid categoryId" }),
  authorId: z.string().min(1, { message: "authorId is required" }),
  price: z
    .number({ message: "Invalid price" })
    .min(0, { message: "Price must be 0 or greater" })
    .optional(),

  images: z.array(z.string().url({ message: "Invalid image URL" })).optional(),
});

export const createIdeaFormZodSchema = z.object({
  title: createIdeaPayloadZodSchema.shape.title,
  problemStatement: createIdeaPayloadZodSchema.shape.problemStatement,
  solution: createIdeaPayloadZodSchema.shape.solution,
  description: createIdeaPayloadZodSchema.shape.description,
  categoryId: createIdeaPayloadZodSchema.shape.categoryId,
  authorId: createIdeaPayloadZodSchema.shape.authorId,

  // Input comes as string from the form; empty string => undefined.
  price: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : Number(val)))
    .refine(
      (val) =>
        val === undefined ||
        (typeof val === "number" && Number.isFinite(val) && val >= 0),
      { message: "Price must be 0 or greater" },
    ),

  // Optional step-by-step photos
  descriptionImage: z.instanceof(File).nullable().optional(),
  solutionImage: z.instanceof(File).nullable().optional(),

  // Optional additional photos
  images: z.array(z.instanceof(File)).optional(),
});

export type ICreateIdeaPayload = z.infer<typeof createIdeaPayloadZodSchema>;
export type ICreateIdeaFormInput = z.input<typeof createIdeaFormZodSchema>;
export type ICreateIdeaFormValues = z.output<typeof createIdeaFormZodSchema>;
