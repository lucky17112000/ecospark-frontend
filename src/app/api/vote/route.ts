import { NextRequest, NextResponse } from "next/server";

// Frontend calls: fetch("/api/vote")
// We forward it to the backend: ${NEXT_PUBLIC_API_BASE_URL}/vote

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAccessTokenFromCookie = (cookieHeader: string): string | null => {
  const match = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export async function POST(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { success: false, message: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const ideaId =
    body &&
    typeof body === "object" &&
    "ideaId" in (body as Record<string, unknown>)
      ? String((body as Record<string, unknown>).ideaId ?? "")
      : "";
  const rawType =
    body &&
    typeof body === "object" &&
    "type" in (body as Record<string, unknown>)
      ? String((body as Record<string, unknown>).type ?? "")
      : "";
  const rawVoteType =
    body &&
    typeof body === "object" &&
    "voteType" in (body as Record<string, unknown>)
      ? String((body as Record<string, unknown>).voteType ?? "")
      : "";

  const voteTypeRaw = rawType || rawVoteType;
  const type =
    voteTypeRaw === "UP" || voteTypeRaw === "DOWN" ? voteTypeRaw : null;

  if (!ideaId.trim() || !type) {
    return NextResponse.json(
      { success: false, message: "Missing or invalid ideaId/voteType" },
      { status: 400 },
    );
  }

  const cookie = request.headers.get("cookie") ?? "";
  const accessToken = cookie ? getAccessTokenFromCookie(cookie) : null;

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (cookie) headers.cookie = cookie;
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;

  const url = new URL(
    "vote",
    API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`,
  );

  const res = await fetch(url.toString(), {
    method: "POST",
    headers,
    body: JSON.stringify({ ideaId: ideaId.trim(), type }),
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
