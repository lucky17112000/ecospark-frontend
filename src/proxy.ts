import { NextRequest, NextResponse } from "next/server";
import { jwtUtiles } from "./lib/jwtUtiles";
import {
  getDashboardRoute,
  getRoutesOnwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtiles";
import { getNewTokenWithRefreshToken } from "./services/auth.service";
import { isTokenExpiredSoon } from "./lib/token.utiles";
async function refreshTokenMiddlware(refreshToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokenWithRefreshToken(refreshToken);
    if (!refresh) {
      console.error("Failed to refresh token in middleware");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    //   console.log("Proxying request:", request);
    const { pathname } = request.nextUrl;
    // console.log("Request pathname:", pathname);
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    // NOTE: Frontend middleware usually shouldn't (and often can't) verify JWT signatures,
    // because it may not have the same secret as the backend that issued the token.
    // For routing UX (block auth pages when logged in), decoding + expiry check is enough.
    const decodedAccessToken = accessToken
      ? (jwtUtiles.decodeToken(accessToken) as unknown as {
          exp?: number;
          role?: UserRole;
        })
      : null;
    const isValidAccessToken = Boolean(
      accessToken &&
      decodedAccessToken?.exp &&
      decodedAccessToken.exp * 1000 > Date.now(),
    );

    let role: UserRole | null = null;
    if (decodedAccessToken) {
      role = decodedAccessToken.role as UserRole;
    }
    const routeOwner = getRoutesOnwner(pathname);
    const unifySuperAdminRole = role === "SUPER_ADMIN" ? "ADMIN" : role;
    role = unifySuperAdminRole as UserRole;
    const isAuth = isAuthRoute(pathname);

    //proactivly refresh toekn if it's about to e
    if (
      isValidAccessToken &&
      accessToken &&
      refreshToken &&
      (await isTokenExpiredSoon(accessToken))
    ) {
      const requestHeader = new Headers(request.headers);
      const response = NextResponse.next({
        request: { headers: requestHeader },
      });

      try {
        const refreshed = await refreshTokenMiddlware(refreshToken);
        if (refreshed) {
          requestHeader.set("x-token-refreshed", "1");
        }
        return NextResponse.next({
          request: { headers: requestHeader },
          headers: response.headers,
        });
      } catch (error) {
        console.error("Error refreshing token in middleware:", error);
      }
      return response;
    }

    if (isAuth && isValidAccessToken && role) {
      return NextResponse.redirect(
        new URL(getDashboardRoute(role as UserRole), request.url),
      );
    }
    //user trying to access public routes
    if (routeOwner === null) {
      return NextResponse.next();
    }
    //access toke nai but jete jacce protected route e
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (routeOwner === "COMMON") {
      return NextResponse.next();
    }
    //user akhn jaite jacce kuno userbased role a but tar role er shate tar required role match korche na
    if (routeOwner === "USER" || routeOwner === "ADMIN") {
      if (routeOwner !== role) {
        return NextResponse.redirect(
          new URL(getDashboardRoute(role as UserRole), request.url),
        );
      }
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);
    return NextResponse.next();
  }
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
