import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const token = searchParams.get("token") ?? undefined;
  const redirectParam = searchParams.get("redirect");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_failed", request.url),
    );
  }

  const safePath =
    redirectParam &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//")
      ? redirectParam
      : "/dashboard";

  const isSecure = process.env.NODE_ENV !== "development";

  const cookieOptions = [
    `accessToken=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600${isSecure ? "; Secure" : ""}`,
    `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${isSecure ? "; Secure" : ""}`,
    ...(token
      ? [
          `better-auth.session_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${isSecure ? "; Secure" : ""}`,
        ]
      : []),
  ];

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Signing in…</title>
  </head>
  <body>
    <script>window.location.replace(${JSON.stringify(safePath)})</script>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": cookieOptions as unknown as string,
    },
  });
}
