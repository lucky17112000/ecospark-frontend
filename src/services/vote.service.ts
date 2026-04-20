// localhost:5000/api/v1/vote

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const castVote = async (ideaId: string, voteType: "UP" | "DOWN") => {
  try {
    const url =
      typeof window === "undefined" && API_BASE_URL
        ? `${API_BASE_URL}/vote`
        : "/api/vote"; // Next.js API proxy: src/app/api/vote/route.ts
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ideaId, type: voteType }),
    });
    if (!res.ok) {
      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        const data = (await res.json().catch(() => null)) as unknown;
        const message =
          data && typeof data === "object" && "message" in data
            ? String((data as Record<string, unknown>).message ?? "")
            : "";

        throw new Error(message || `Failed to cast vote (HTTP ${res.status})`);
      }

      const errorText = await res.text().catch(() => "");
      const compact = errorText.replace(/\s+/g, " ").trim();
      const snippet =
        compact.length > 200 ? `${compact.slice(0, 200)}…` : compact;
      throw new Error(
        `Failed to cast vote (HTTP ${res.status})${snippet ? `: ${snippet}` : ""}`,
      );
    }
    return await res.json();
  } catch (error) {
    console.error("Error casting vote:", error);
    throw error;
  }
};
