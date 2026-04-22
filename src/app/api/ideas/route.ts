import { NextRequest, NextResponse } from "next/server";

// This route is a proxy used by the frontend Create Idea flow.
// Frontend calls: fetch("/api/ideas")
// We forward it to the backend: ${NEXT_PUBLIC_API_BASE_URL}/api/v1/idea (or /idea if base already includes /api/v1)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getBackendIdeaUrl = (): string => {
  if (!API_BASE_URL) return "";
  const base = API_BASE_URL.replace(/\/$/, "");
  // If the env already points to the API version root (e.g. http://localhost:5000/api/v1)
  // then we only need to append /idea.
  if (/\/api\/v\d+$/i.test(base)) return `${base}/idea`;
  // Otherwise, assume the backend expects the versioned prefix.
  return `${base}/api/v1/idea`;
};

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

  const backendUrl = getBackendIdeaUrl();

  const cookie = request.headers.get("cookie") ?? "";
  const accessToken = cookie ? getAccessTokenFromCookie(cookie) : null;

  const headers: Record<string, string> = {};
  if (cookie) headers.cookie = cookie;
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;

  const res = await fetch(backendUrl, {
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

  const backendUrl = getBackendIdeaUrl();

  const cookie = request.headers.get("cookie") ?? "";
  const accessToken = cookie ? getAccessTokenFromCookie(cookie) : null;
  const contentType = request.headers.get("content-type") ?? "";

  const headers: Record<string, string> = {};
  if (cookie) headers.cookie = cookie;
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;

  // IMPORTANT:
  // Don't call request.formData() here.
  // Parsing multipart uploads in this proxy can throw "Unexpected end of form"
  // and also buffers the whole upload in memory.
  // Instead, forward the request body stream directly to the backend.
  if (contentType) headers["content-type"] = contentType;
  const body = request.body;

  const res = await fetch(backendUrl, {
    method: "POST",
    headers,
    body,
    // Required by Node.js fetch when streaming a request body
    // (safe to include; ignored in runtimes that don't need it)
    // @ts-expect-error - duplex is a Node.js fetch option
    duplex: "half",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
