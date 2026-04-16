"use server";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookie } from "@/lib/token.utiles";
import { ILoginResponse } from "@/types/auth.type";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { ApiError } from "next/dist/server/api-utils";
import { redirect } from "next/navigation";

export const getIdea = async () => {
  const idea = await httpClient.get("/idea");
  return idea;
};

export const loginAction = async (
  payload: ILoginPayload,
): Promise<ILoginResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    console.error(
      "Validation failed:",
      parsedPayload.error.issues[0].message || "Unknown validation error",
    );
    throw new ApiError(400, parsedPayload.error.issues[0].message);
  }
  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );
    const { accessToken, refreshToken, token } = response.data;
    await setTokenInCookie("accessToken", accessToken);
    await setTokenInCookie("refreshToken", refreshToken);
    await setTokenInCookie("better-auth.session_token", token);
    // return response.data;
    redirect("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
