import { NextRequest, NextResponse } from "next/server";

// Proxy route for admin idea status updates.
// Frontend calls: fetch("/api/idea/status")
// We forward it to the backend: ${NEXT_PUBLIC_API_BASE_URL}/idea/status

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAccessTokenFromCookie = (cookieHeader: string): string | null => {
  const match = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export async function PUT(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { success: false, message: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  const cookie = request.headers.get("cookie") ?? "";
  const accessToken = cookie ? getAccessTokenFromCookie(cookie) : null;

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (cookie) headers.cookie = cookie;
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;

  const payload = await request.json().catch(() => null);

  const res = await fetch(`${API_BASE_URL}/idea/status`, {
    method: "PUT",
    headers,
    body: payload ? JSON.stringify(payload) : "{}",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
