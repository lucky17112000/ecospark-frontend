import { NextRequest, NextResponse } from "next/server";

// This route is a proxy used by the frontend Create Idea flow.
// Frontend calls: fetch("/api/ideas")
// We forward it to the backend: ${NEXT_PUBLIC_API_BASE_URL}/idea

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAccessTokenFromCookie = (cookieHeader: string): string | null => {
  const match = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export async function GET(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { success: false, message: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  const cookie = request.headers.get("cookie") ?? "";
  const accessToken = cookie ? getAccessTokenFromCookie(cookie) : null;

  const headers: Record<string, string> = {};
  if (cookie) headers.cookie = cookie;
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${API_BASE_URL}/idea`, {
    method: "GET",
    headers: Object.keys(headers).length ? headers : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function POST(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { success: false, message: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  const cookie = request.headers.get("cookie") ?? "";
  const accessToken = cookie ? getAccessTokenFromCookie(cookie) : null;
  const contentType = request.headers.get("content-type") ?? "";

  const headers: Record<string, string> = {};
  if (cookie) headers.cookie = cookie;
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;

  let body: BodyInit | undefined;
  if (contentType.includes("multipart/form-data")) {
    body = await request.formData();
  } else {
    const json = await request.json().catch(() => null);
    body = json ? JSON.stringify(json) : "";
    headers["content-type"] = "application/json";
  }

  const res = await fetch(`${API_BASE_URL}/idea`, {
    method: "POST",
    headers,
    body,
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
