"use server";
import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.types";
import type { IIdeaResponse } from "@/types/idea.type";
import { cookies, headers } from "next/headers";
import {
  createIdeaFormZodSchema,
  ICreateIdeaFormInput,
} from "@/zod/idea.validation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export const getIdea = async (): Promise<ApiResponse<IIdeaResponse[]>> => {
//   try {
//     const url =
//       typeof window === "undefined" && API_BASE_URL
//         ? `${API_BASE_URL}/idea`
//         : "/api/ideas"; // Next.js API proxy: src/app/api/ideas/route.ts

//     const res = await fetch(url, { method: "GET", cache: "no-store" });
//     return (await res.json()) as ApiResponse<IIdeaResponse[]>;
//   } catch (error) {
//     console.error("Error fetching ideas:", error);
//     throw error;
//   }
// };
export type GetIdeaParams = {
  page?: number;
  limit?: number;
  status?: string;
  searchTerm?: string;
};
export const getIdea = async (
  params?: GetIdeaParams,
): Promise<ApiResponse<IIdeaResponse[]>> => {
  try {
    const response = await httpClient.get<IIdeaResponse[]>("/idea", { params });
    return response;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    throw error;
  }
};

export const createIdea = async (
  values: ICreateIdeaFormInput,
): Promise<ApiResponse<IIdeaResponse>> => {
  const safeParse = createIdeaFormZodSchema.safeParse(values);
  if (!safeParse.success) {
    console.error(
      "Validation failed:",
      safeParse.error.issues[0].message || "Unknown validation error",
    );
    throw new Error(safeParse.error.issues[0].message);
  }
  try {
    const formData = new FormData();
    formData.append("title", safeParse.data.title);
    formData.append("problemStatement", safeParse.data.problemStatement);
    formData.append("description", safeParse.data.description);
    formData.append("categoryId", safeParse.data.categoryId);
    formData.append("authorId", safeParse.data.authorId);

    // Backend expects `solutinon` (typo)
    formData.append("solutinon", safeParse.data.solution);

    if (safeParse.data.price !== undefined && safeParse.data.price !== null) {
      formData.append("price", String(safeParse.data.price));
    }

    // Backend multer expects field name `files`
    if (safeParse.data.descriptionImage) {
      formData.append("files", safeParse.data.descriptionImage);
    }
    if (safeParse.data.solutionImage) {
      formData.append("files", safeParse.data.solutionImage);
    }
    if (safeParse.data.images?.length) {
      safeParse.data.images.forEach((file) => formData.append("files", file));
    }

    // Server Actions run on the server, where relative URLs like "/api/ideas" are invalid.
    // Build an absolute URL to our Next.js route handler and forward cookies for auth.
    const h = await headers();
    const forwardedProto = h.get("x-forwarded-proto") ?? "http";
    const forwardedHost = h.get("x-forwarded-host") ?? h.get("host");
    const origin = forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : "http://localhost:3000";

    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(new URL("/api/ideas", origin), {
      method: "POST",
      body: formData,
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
    // POST goes through Next.js API proxy: src/app/api/ideas/route.ts

    const text = await res.text();
    const parsed = (() => {
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return null;
      }
    })();

    if (!res.ok) {
      const msgFromBody = (() => {
        if (!parsed || typeof parsed !== "object") return "";

        const errorSources = (parsed as { errorSources?: unknown })
          .errorSources;
        if (Array.isArray(errorSources) && errorSources.length > 0) {
          const first = errorSources[0] as {
            message?: unknown;
            path?: unknown;
          };
          const m = typeof first?.message === "string" ? first.message : "";
          const p =
            typeof first?.path === "string" && first.path
              ? ` (${first.path})`
              : "";
          if (m.trim()) return `${m.trim()}${p}`;
        }

        const maybeMessage = (parsed as { message?: unknown }).message;
        if (typeof maybeMessage === "string" && maybeMessage.trim()) {
          return maybeMessage.trim();
        }

        const devError = (parsed as { error?: unknown }).error;
        if (devError && typeof devError === "object") {
          const issues = (devError as { issues?: unknown }).issues;
          if (Array.isArray(issues) && issues.length > 0) {
            const firstIssue = issues[0] as {
              message?: unknown;
              path?: unknown;
            };
            const m =
              typeof firstIssue?.message === "string" ? firstIssue.message : "";
            const p = Array.isArray(firstIssue?.path)
              ? firstIssue.path.join(".")
              : "";
            if (m.trim()) return p ? `${m.trim()} (${p})` : m.trim();
          }
        }

        return "";
      })();

      const snippet = typeof text === "string" ? text.trim() : "";
      const safeSnippet =
        snippet.length > 200 ? `${snippet.slice(0, 200)}…` : snippet;

      const msg =
        msgFromBody ||
        safeSnippet ||
        `Failed to create idea (status ${res.status})`;

      throw new Error(`${msg} (status ${res.status})`);
    }

    if (!parsed) throw new Error("Unexpected response from server");
    return parsed as ApiResponse<IIdeaResponse>;
  } catch (error) {
    console.error("Error creating idea:", error);
    throw error;
  }
};
// export const ideaUpdatebyAdminAction = async (payload: any) => {
//   try {
//     const response = await fetch("/api/idea/status", {
//       method: "PUT",
//       headers: { "content-type": "application/json" },
//       body: JSON.stringify(payload),
//       credentials: "include",
//     });

//     const text = await response.text();
//     const parsed = (() => {
//       try {
//         return JSON.parse(text) as unknown;
//       } catch {
//         return null;
//       }
//     })();

//     if (!response.ok) {
//       const messageFromBody =
//         parsed && typeof parsed === "object"
//           ? (parsed as { message?: unknown }).message
//           : undefined;

//       const message =
//         typeof messageFromBody === "string" && messageFromBody.trim()
//           ? messageFromBody.trim()
//           : text.trim() || `Failed to update idea (status ${response.status})`;

//       throw new Error(message);
//     }

//     if (!parsed) throw new Error("Unexpected response from server");
//     return parsed as ApiResponse<unknown>;
//   } catch (error) {
//     console.error("Error updating idea:", error);
//     throw error;
//   }
// };

export const ideaUpdatebyAdminAction = async (
  payload: any,
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await httpClient.put("/idea/status", payload);
    return response;
  } catch (error) {
    console.error("Error updating idea:", error);
    throw error;
  }
};
// export const deleteIdea = async (id: string): Promise<ApiResponse<unknown>> => {
//   try {
//     if (!id?.trim()) throw new Error("Missing id");
//     return await httpClient.delete<unknown>(`/idea/soft`, {
//       params: { id },
//     });
//   } catch (error) {
//     console.error("Error deleting idea:", error);
//     throw error;
//   }
// };

// export const getIdeatestvaia = async (): Promise<
//   ApiResponse<IIdeaResponse[]>
// > => {
//   try {
//     const url =
//       typeof window === "undefined" && API_BASE_URL
//         ? `${API_BASE_URL}/idea`
//         : "/api/ideas"; // Next.js API proxy: src/app/api/ideas/route.ts

//     const res = await fetch(url, { method: "GET", cache: "no-store" });
//     return (await res.json()) as ApiResponse<IIdeaResponse[]>;
//   } catch (error) {
//     console.error("Error fetching ideas:", error);
//     throw error;
//   }
// };

type DeleteByAdminPayload = { id: string };

// export const softDeleteIdeaByAdminAction = async (
//   payload: DeleteByAdminPayload,
// ): Promise<ApiResponse<unknown>> => {
//   if (!payload?.id?.trim()) throw new Error("Missing id");

//   if (!API_BASE_URL) {
//     throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
//   }

//   const cookieStore = await cookies();
//   const cookieHeader = cookieStore
//     .getAll()
//     .map((cookie) => `${cookie.name}=${cookie.value}`)
//     .join("; ");
//   const accessToken = cookieStore.get("accessToken")?.value;

//   const headers: Record<string, string> = {
//     "content-type": "application/json",
//   };
//   if (cookieHeader) headers.cookie = cookieHeader;
//   if (accessToken) headers.authorization = `Bearer ${accessToken}`;

//   const url = new URL(
//     "idea/soft/by-admin",
//     API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`,
//   );

//   const res = await fetch(url.toString(), {
//     method: "DELETE",
//     body: JSON.stringify({ id: payload.id }),
//     cache: "no-store",
//     headers,
//   });

//   const text = await res.text();
//   const parsed = (() => {
//     try {
//       return JSON.parse(text) as unknown;
//     } catch {
//       return null;
//     }
//   })();

//   if (!res.ok) {
//     const msg =
//       parsed && typeof parsed === "object" && "message" in parsed
//         ? String((parsed as { message?: unknown }).message)
//         : text.trim() || `Failed (status ${res.status})`;
//     throw new Error(msg);
//   }

//   if (!parsed) throw new Error("Unexpected response from server");
//   return parsed as ApiResponse<unknown>;
// };

export const softDeleteIdeaByAdminAction = async (
  payload: DeleteByAdminPayload,
): Promise<ApiResponse<unknown>> => {
  try {
    if (!payload?.id?.trim()) throw new Error("Missing id");
    return await httpClient.delete<unknown>("/idea/soft/by-admin", {
      data: payload,
    });
  } catch (error) {
    console.error("Error deleting idea:", error);
    throw error;
  }
};
// export const getIdea2 = async (payload: DeleteByAdminPayload): => {
//   return await httpClient.get<IIdeaResponse[]>("/idea");
// };
