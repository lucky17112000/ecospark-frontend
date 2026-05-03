"use server";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { createBlogZodSchema, ICreateBlogPayload } from "@/zod/blog.validation";
import axios from "axios";

export type GetBlogResponse = {
  id?: string;
  title: string;
  content: string;
  authorName?: string;
  author?: { name?: string; email?: string };
  createdAt?: string;
};

export const getBlogs = async (): Promise<ApiResponse<GetBlogResponse[]>> => {
  try {
    const response = await httpClient.get<GetBlogResponse[]>("/blog");
    return response;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const deleteBlog = async (
  id: string,
): Promise<ApiResponse<null>> => {
  try {
    const response = await httpClient.delete<null>(`/blog/${id}`);
    return response;
  } catch (error) {
    let message = "Failed to delete blog post. Please try again.";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data.message || message;
    }
    return { success: false, message, data: null };
  }
};

export const createBlog = async (
  payload: ICreateBlogPayload,
): Promise<ApiResponse<GetBlogResponse>> => {
  const parsedPayload = createBlogZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    const message =
      parsedPayload.error.issues[0].message || "Unknown validation error";
    console.error("Validation failed:", message);
    return {
      success: false,
      message,
      data: null as unknown as GetBlogResponse,
    };
  }
  try {
    const response = await httpClient.post<GetBlogResponse>(
      "/blog",
      parsedPayload.data,
    );
    return response;
  } catch (error) {
    let message = "Failed to create blog post. Please try again.";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data.message || message;
    }
    return {
      success: false,
      message,
      data: null as unknown as GetBlogResponse,
    };
  }
};
