import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.types";
import type { IIdeaResponse } from "@/types/idea.type";
import {
  createIdeaFormZodSchema,
  ICreateIdeaFormInput,
} from "@/zod/idea.validation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getIdea = async (): Promise<ApiResponse<IIdeaResponse[]>> => {
  try {
    const url =
      typeof window === "undefined" && API_BASE_URL
        ? `${API_BASE_URL}/idea`
        : "/api/ideas"; // Next.js API proxy: src/app/api/ideas/route.ts

    const res = await fetch(url, { method: "GET", cache: "no-store" });
    return (await res.json()) as ApiResponse<IIdeaResponse[]>;
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

    const res = await fetch("/api/ideas", {
      method: "POST",
      body: formData,
      credentials: "include",
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
export const ideaUpdatebyAdminAction = async (payload: any) => {
  try {
    const response = await fetch("/api/idea/status", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const text = await response.text();
    const parsed = (() => {
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return null;
      }
    })();

    if (!response.ok) {
      const messageFromBody =
        parsed && typeof parsed === "object"
          ? (parsed as { message?: unknown }).message
          : undefined;

      const message =
        typeof messageFromBody === "string" && messageFromBody.trim()
          ? messageFromBody.trim()
          : text.trim() || `Failed to update idea (status ${response.status})`;

      throw new Error(message);
    }

    if (!parsed) throw new Error("Unexpected response from server");
    return parsed as ApiResponse<unknown>;
  } catch (error) {
    console.error("Error updating idea:", error);
    throw error;
  }
};
