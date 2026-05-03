"use server";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

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
