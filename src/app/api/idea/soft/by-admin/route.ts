import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAccessTokenFromCookie = (cookieHeader: string): string | null => {
  const match = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export async function DELETE(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { success: false, message: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const idFromBody =
    body && typeof body === "object" && "id" in (body as any)
      ? String((body as any).id ?? "")
      : "";

  const idFromQuery = request.nextUrl.searchParams.get("id") ?? "";
  const id = (idFromBody || idFromQuery).trim();

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing id" },
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
    "idea/soft/by-admin",
    API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`,
  );

  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers,
    body: JSON.stringify({ id }),
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
