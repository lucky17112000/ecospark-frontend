import { ApiResponse } from "@/types/api.types";
import { ICategoryResponse } from "@/types/categories.type";

export const getcategories = async (): Promise<
  ApiResponse<ICategoryResponse[]>
> => {
  try {
    const res = await fetch("/api/categories", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const data = (await res.json()) as ApiResponse<ICategoryResponse[]>;
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
