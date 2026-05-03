import { title } from "process";
import z from "zod";

export const createBlogZodSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  content: z.string().min(1, { message: "Content is required" }),
  authorId: z.string(),
});
export type ICreateBlogPayload = z.infer<typeof createBlogZodSchema>;
