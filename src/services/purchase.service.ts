"use server";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import type { IIdeaResponse } from "@/types/idea.type";

export type purhasePaylod = {
  ideaId: string;
};
export type CreatePurchaseData = {
  sessionUrl: string;
  sessionId?: string;
  paymentData?: unknown;
  result?: unknown;
};
export const createPurchaseAction = async (
  payload: purhasePaylod,
): Promise<ApiResponse<CreatePurchaseData>> => {
  try {
    const response = await httpClient.post<CreatePurchaseData>(
      "/purchase",
      payload,
    );
    return response;
  } catch (error) {
    console.error("Error creating purchase:", error);
    throw error;
  }
};

export type UserPurchaseRecord = {
  id: string;
  paymentStatus?: "PAID" | "UNPAID";
  createdAt?: string | Date;
  updatedAt?: string | Date;
  idea?: IIdeaResponse;
};

export const getUserPurchases = async (): Promise<
  ApiResponse<UserPurchaseRecord[]>
> => {
  try {
    const response = await httpClient.get<UserPurchaseRecord[]>("/purchase/me");
    return response;
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    throw error;
  }
};
