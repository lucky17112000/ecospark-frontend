"use server";
import { httpClient } from "@/lib/axios/httpClient";
import { deleteCookie } from "@/lib/cookie.utiles";
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

const getBaseApiUrl = (): string => {
  const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseApiUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }
  return baseApiUrl;
};

// export const getIdea = async () => {
//   const idea = await httpClient.get("/idea");
//   return idea;
// };

export const loginAction = async (
  payload: ILoginPayload,
): Promise<ApiResponse<ILoginResponse>> => {
  const parsedPayload = loginZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    const message =
      parsedPayload.error.issues[0].message || "Unknown validation error";
    console.error("Validation failed:", message);
    return {
      success: false,
      message,
      data: null as unknown as ILoginResponse,
    };
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
    let message = "Login failed. Please try again.";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as unknown;
      const maybeMessage =
        data && typeof data === "object"
          ? (data as { message?: unknown }).message
          : undefined;
      if (typeof maybeMessage === "string" && maybeMessage.trim()) {
        message = maybeMessage.trim();
      } else if (typeof error.message === "string" && error.message.trim()) {
        message = error.message.trim();
      }
    } else if (error instanceof Error && error.message.trim()) {
      message = error.message.trim();
    }

    console.error("Login failed:", error);
    return {
      success: false,
      message,
      data: null as unknown as ILoginResponse,
    };
  }
};

export const registerAction = async (
  payload: IRegisterPayload,
): Promise<ApiResponse<IRegisterResponse>> => {
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
    return response;
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
  const baseApiUrl = getBaseApiUrl();
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
  const res = await fetch(`${baseApiUrl}/auth/me`, {
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
    const baseApiUrl = getBaseApiUrl();
    const res = await fetch(`${baseApiUrl}/auth/refresh-token`, {
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
): Promise<ApiResponse<unknown>> => {
  try {
    const resposne = await httpClient.post("/auth/change-password", payload);
    if (!resposne.success) {
      return {
        success: false,
        message: resposne.message || "Change password failed",
        data: null,
      };
    }
    return resposne;
  } catch (error) {
    console.error("Change password failed:", error);
    return {
      success: false,
      message: "Change password failed",
      data: null,
    };
  }
};
export type ForgotPasswordPayload = {
  email: string;
};

export const forgotPasswordAction = async (
  payload: ForgotPasswordPayload,
): Promise<ApiResponse<unknown>> => {
  try {
    const resposne = await httpClient.post("/auth/forget-password", payload);
    if (!resposne.success) {
      return {
        success: false,
        message: resposne.message || "Forgot password request failed",
        data: null,
      };
    }
    return resposne;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNREFUSED") {
      return {
        success: false,
        message:
          "API server is not reachable (ECONNREFUSED). Start ecospark-backend or check NEXT_PUBLIC_API_BASE_URL.",
        data: null,
      };
    }

    console.error("Forgot password request failed:", error);
    return {
      success: false,
      message: "Forgot password request failed",
      data: null,
    };
  }
};

export const logoutAction = async () => {
  await deleteCookie("accessToken");
  await deleteCookie("refreshToken");
  await deleteCookie("better-auth.session_token");
};

// Called by the Google OAuth callback page — same as loginAction cookie logic
// export const setGoogleTokensAction = async ({
//   accessToken,
//   refreshToken,
//   token,
// }: {
//   accessToken: string;
//   refreshToken: string;
//   token?: string;
// }): Promise<{ success: boolean; message: string }> => {
//   try {
//     await setTokenInCookie("accessToken", accessToken);
//     await setTokenInCookie("refreshToken", refreshToken);
//     if (token) {
//       await setTokenInCookie("better-auth.session_token", token, 24 * 60 * 60);
//     }
//     return { success: true, message: "Tokens set successfully" };
//   } catch (error) {
//     console.error("Failed to set Google tokens:", error);
//     return { success: false, message: "Failed to set authentication tokens" };
//   }
// };
