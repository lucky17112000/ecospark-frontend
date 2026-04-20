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

  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!id.trim()) {
    return NextResponse.json(
      { success: false, message: "Missing id" },
      { status: 400 },
    );
  }

  const cookie = request.headers.get("cookie") ?? "";
  console.log("cookie header:", request.headers.get("cookie"));
  const accessToken = cookie ? getAccessTokenFromCookie(cookie) : null;

  const headers: Record<string, string> = {};
  if (cookie) headers.cookie = cookie;
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;

  const url = new URL(
    "idea/soft",
    API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`,
  );
  url.searchParams.set("id", id);

  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: Object.keys(headers).length ? headers : undefined,
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
