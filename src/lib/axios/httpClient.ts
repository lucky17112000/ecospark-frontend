import { ApiResponse } from "@/types/api.types";
import axios from "axios";
// import { isTokenExpiredSoon } from "../tokenUtiles";
import { cookies, headers } from "next/headers";
import { isTokenExpiredSoon } from "../token.utiles";
import { getNewTokenWithRefreshToken } from "@/services/auth.service";
// import { getNewTokenWithRefreshToken } from "@/services/auth.services";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}
const axiosInstance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (accessToken && refreshToken) {
    await tryRefreshToken(accessToken, refreshToken);
  }

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookieHeader) {
    baseHeaders.Cookie = cookieHeader;
  }
  //eg: cookie: "accessToken=abc123; refreshToken=def456"
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: baseHeaders,
  });
  return instance;
};

async function tryRefreshToken(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  if (!(await isTokenExpiredSoon(accessToken))) {
    return;
  }
  const requestHeader = await headers();
  if (requestHeader.get("x-token-refreshed") === "1") {
    return;
  }
  try {
    await getNewTokenWithRefreshToken(refreshToken);
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
}
export interface ApiRequestResponse {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  data?: unknown;
}
const httpGet = async <TData>(
  endpoint: string,
  options?: ApiRequestResponse,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.get<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error("HTTP GET request failed:", error);
    throw error;
  }
};

//!SECTION for post
const httpPost = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestResponse,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const url = `${error.config?.baseURL ?? ""}${error.config?.url ?? endpoint}`;
      console.error(
        `HTTP POST request failed${status ? ` (status ${status})` : ""}: ${url} - ${error.message}`,
      );
    } else {
      console.error("HTTP POST request failed:", error);
    }
    throw error;
  }
};
//!SECTION for put
const httpPut = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestResponse,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error("HTTP PUT request failed:", error);
    throw error;
  }
};
//!SECTION for delete
const httpDelete = async <TData>(
  endpoint: string,
  options?: ApiRequestResponse,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();

    const response = await instance.delete<ApiResponse<TData>>(endpoint, {
      data: options?.data,
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error("HTTP DELETE request failed:", error);
    throw error;
  }
};
//!SECTION for patch
const httpPatch = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestResponse,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error("HTTP PATCH request failed:", error);
    throw error;
  }
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  delete: httpDelete,
  patch: httpPatch,
};
