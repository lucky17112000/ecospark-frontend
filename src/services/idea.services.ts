import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.types";
import type { IIdeaResponse } from "@/types/idea.type";

export const getIdea = async (): Promise<ApiResponse<IIdeaResponse[]>> => {
  try {
    const idea = await httpClient.get<IIdeaResponse[]>("/idea");

    return idea;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    throw error;
  }
};
