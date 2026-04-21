"use server";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookie } from "@/lib/token.utiles";
import type { ApiErrorResponse } from "@/types/api.types";
import type { ApiResponse } from "@/types/api.types";
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
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!BASE_API_URL) {
  throw new Error("BASE_API_URL is not defined in environment variables");
}

// export const getIdea = async () => {
//   const idea = await httpClient.get("/idea");
//   return idea;
// };

export const loginAction = async (
  payload: ILoginPayload,
): Promise<ApiResponse<ILoginResponse>> => {
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
    return response;
    // redirect("/dashboard");
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

export async function getUserInfo() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  if (!accessToken) {
    return {
      id: "",
      email: "",
      role: "",
      needPasswordChange: false,
    };
  }
  const res = await fetch(`${BASE_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken} ; better-auth.session_token=${sessionToken}`,
    },
  });
  if (!res.ok) {
    return {
      id: "",
      email: "",
      role: "",
      needPasswordChange: false,
    };
  }
  const { data } = await res.json();
  return data;
}

export async function getNewTokenWithRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `refreshToken=${refreshToken}`,
      },
      // body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      console.error("Token refresh failed with status:", res.status);
      return false;
    }
    const { data } = await res.json();
    const { accessToken, refreshToken: newRefreshToken, token } = data;
    if (accessToken) {
      await setTokenInCookie("accessToken", accessToken);
    }
    if (newRefreshToken) {
      await setTokenInCookie("refreshToken", newRefreshToken);
    }
    if (token) {
      await setTokenInCookie("better-auth.session_token", token, 24 * 60 * 60); // 1 day
    }
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
}

/*
export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
*/

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
export const changePasswordAction = async (
  payload: ChangePasswordPayload,
): Promise<Promise<unknown>> => {
  try {
    const resposne = await httpClient.post("/auth/change-password", payload);
    if (!resposne.success) {
      return {
        success: false,
        message: resposne.message || "Change password failed",
      };
    }
    return resposne;
  } catch (error) {
    console.error("Change password failed:", error);
    return {
      success: false,
      message: "Change password failed",
    };
  }
};
