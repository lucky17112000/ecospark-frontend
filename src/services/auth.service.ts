"use server";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookie } from "@/lib/token.utiles";
import type { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse, IRegisterResponse } from "@/types/auth.type";
import {
  ILoginPayload,
  IRegisterPayload,
  IVerifyEmailPayload,
  loginZodSchema,
  registerZodSchema,
  verifyEmailZodSchema,
} from "@/zod/auth.validation";
import axios from "axios";
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

export const registerAction = async (
  payload: IRegisterPayload,
): Promise<IRegisterResponse> => {
  const parsedPayload = registerZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    console.error(
      "Validation failed:",
      parsedPayload.error.issues[0].message || "Unknown validation error",
    );
    throw new ApiError(400, parsedPayload.error.issues[0].message);
  }
  try {
    const response = await httpClient.post<IRegisterResponse>(
      "/auth/register",
      payload,
    );
    const { accessToken, refreshToken, token } = response.data;
    await setTokenInCookie("accessToken", accessToken);
    await setTokenInCookie("refreshToken", refreshToken);
    await setTokenInCookie("better-auth.session_token", token);
    // return response.data;

    redirect("/verify-email?email=" + response.data.user.email);
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const verifyEmailAction = async (
  payload: IVerifyEmailPayload,
): Promise<ApiErrorResponse> => {
  const parsedPayload = verifyEmailZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    const response = await httpClient.post<null>(
      "/auth/verify-email",
      parsedPayload.data,
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Email verification failed",
      };
    }

    return { success: true, message: response.message || "Email verified" };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data as unknown;

      const messageFromServer =
        typeof data === "object" && data !== null
          ? (data as { message?: unknown }).message
          : undefined;

      const message =
        (typeof messageFromServer === "string" && messageFromServer) ||
        error.message ||
        "Email verification failed";

      // Keep logs small (avoid dumping full Axios error object)
      console.error(
        `Email verification failed${status ? ` (status ${status})` : ""}: ${message}`,
      );

      return {
        success: false,
        message,
      };
    }

    console.error("Email verification failed");
    return { success: false, message: "Email verification failed" };
  }
};
