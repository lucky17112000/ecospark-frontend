export type UserRole = "ADMIN" | "USER" | "GUEST" | "SUPER_ADMIN";
export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
] as const;

export const isAuthRoute = (pathName: string) => {
  const normalizedPathName =
    pathName.length > 1 && pathName.endsWith("/")
      ? pathName.slice(0, -1)
      : pathName;
  return authRoutes.some((router: string) => router === normalizedPathName);
};
export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};
export const userProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard/],
  exact: ["/payment/success"],
};

export const commonProtectedRoutes: RouteConfig = {
  pattern: [],
  exact: ["/my-profile", "/change-password"],
};
export const adminorSuperAdminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin\/dashboard/],
  exact: [],
};

export const isRoutesMatches = (pathName: string, routeConfig: RouteConfig) => {
  if (routeConfig.exact.includes(pathName)) return true;
  return routeConfig.pattern.some((pattern) => pattern.test(pathName));
};

export const getRoutesOnwner = (
  pathName: string,
): "SUPER_ADMIN" | "ADMIN" | "USER" | "COMMON" | null => {
  if (isRoutesMatches(pathName, userProtectedRoutes)) return "USER";

  if (isRoutesMatches(pathName, adminorSuperAdminProtectedRoutes))
    return "ADMIN";
  if (isRoutesMatches(pathName, commonProtectedRoutes)) return "COMMON";
  return null;
};

export const getDashboardRoute = (role: UserRole) => {
  if (role === "USER") return "/dashboard";

  if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin/dashboard";
  return "/";
};

export const isvalidRedirectForRole = (
  redirectpath: string,
  role: UserRole,
): boolean => {
  const unifyedRole = role === "SUPER_ADMIN" ? "ADMIN" : role;
  role = unifyedRole;
  const routeOwner = getRoutesOnwner(redirectpath);
  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }
  if (routeOwner === role) return true;
  return false;
};
