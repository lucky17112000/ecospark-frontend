"use client";

import LogoutButton from "@/components/shared/LogoutButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/services/auth.service";
import { NavSection } from "@/types/dashboard.type";
import { UserInfo } from "@/types/user.types";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentType, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

interface NavItemProps {
  href: string;
  Icon: ComponentType<{ className?: string }>;
  title: string;
  isActive: boolean;
  isCollapsed: boolean;
}

// ─── Nav item ─────────────────────────────────────────────────────────────────

const SidebarNavItem = ({
  href,
  Icon,
  title,
  isActive,
  isCollapsed,
}: NavItemProps) => (
  <Link
    href={href}
    title={isCollapsed ? title : undefined}
    className={cn(
      "relative group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
      "transition-all duration-200 ease-in-out",
      isCollapsed && "justify-center px-2.5",
      isActive
        ? [
            "bg-emerald-50 text-emerald-700",
            "dark:bg-emerald-950/50 dark:text-emerald-300",
            "shadow-sm shadow-emerald-100 dark:shadow-emerald-900/20",
          ]
        : [
            "text-muted-foreground",
            "hover:bg-emerald-50/70 hover:text-emerald-700",
            "dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400",
          ],
    )}
  >
    {/* Left active indicator bar */}
    {isActive && !isCollapsed && (
      <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-emerald-500" />
    )}

    {/* Icon */}
    <Icon
      className={cn(
        "size-4 shrink-0 transition-transform duration-200",
        isActive
          ? "text-emerald-600 dark:text-emerald-400"
          : "group-hover:scale-110 group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
      )}
    />

    {/* Label */}
    <span
      className={cn(
        "truncate transition-all duration-200 origin-left",
        isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100",
      )}
    >
      {title}
    </span>
  </Link>
);

// ─── Collapsed logout ─────────────────────────────────────────────────────────

const CollapsedLogoutButton = ({ redirectTo }: { redirectTo: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      title="Logout"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await logoutAction();
          router.replace(redirectTo);
          router.refresh();
        } finally {
          setLoading(false);
        }
      }}
      className={cn(
        "flex w-full justify-center rounded-xl p-2.5",
        "text-red-400 transition-all duration-200",
        "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400",
        "active:scale-95",
        loading && "opacity-50 cursor-not-allowed",
      )}
    >
      <LogOut className="size-4" />
    </button>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const DashboardSidebarContent = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userInitial = userInfo?.name?.charAt(0).toUpperCase() ?? "?";
  const userRoleLabel = userInfo?.role?.toLowerCase().replace("_", " ") ?? "";

  return (
    <div
      className={cn(
        "hidden md:flex h-full flex-col border-r bg-sidebar relative",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-17" : "w-64",
      )}
    >
      {/* ── Collapse / Expand toggle ──────────────────────────────────── */}
      <button
        onClick={() => setIsCollapsed((prev) => !prev)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute -right-3 top-20 z-20",
          "flex size-6 items-center justify-center rounded-full",
          "border border-emerald-200 bg-white shadow-md dark:border-emerald-800/60 dark:bg-sidebar",
          "text-emerald-600 dark:text-emerald-400",
          "hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-emerald-100",
          "dark:hover:bg-emerald-950/50 dark:hover:border-emerald-700",
          "transition-all duration-200 active:scale-90",
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="size-3.5" />
        ) : (
          <ChevronLeft className="size-3.5" />
        )}
      </button>

      {/* ── Brand header ─────────────────────────────────────────────── */}
      <div className="relative h-16 shrink-0 overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-700">
        {/* Decorative orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-4 size-16 rounded-full bg-white/10 blur-xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-3 left-1/3 size-12 rounded-full bg-teal-400/20 blur-lg"
        />
        {/* Dot texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        <Link
          href={dashboardHome}
          className={cn(
            "relative z-10 flex h-full items-center",
            isCollapsed ? "justify-center" : "gap-2.5 px-5",
          )}
        >
          {/* Icon chip */}
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/20 backdrop-blur-sm transition-all duration-200">
            <Sprout
              className={cn(
                "text-white transition-all duration-200",
                isCollapsed ? "size-5" : "size-4",
              )}
            />
          </div>

          {/* Brand name */}
          <span
            className={cn(
              "text-xl font-extrabold tracking-tight text-white whitespace-nowrap",
              "transition-all duration-200 origin-left",
              isCollapsed
                ? "w-0 opacity-0 overflow-hidden"
                : "w-auto opacity-100",
            )}
          >
            EcoSpark
          </span>
        </Link>

        {/* Bottom shimmer line */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent"
        />
      </div>

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <ScrollArea className="flex-1 py-3">
        <nav className={cn("space-y-4", isCollapsed ? "px-2" : "px-3")}>
          {navItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {/* Section heading */}
              {section.title && (
                <div
                  className={cn(
                    "transition-all duration-200 overflow-hidden",
                    isCollapsed
                      ? "h-0 mb-0 opacity-0"
                      : "h-auto mb-1.5 opacity-100",
                  )}
                >
                  <h4 className="flex items-center gap-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600/70 dark:text-emerald-500/70">
                    {section.title}
                  </h4>
                </div>
              )}

              {/* Nav links */}
              <div className="space-y-0.5">
                {section.items.map((item, itemIdx) => {
                  const Icon = getIconComponent(item.icon as string);
                  return (
                    <SidebarNavItem
                      key={itemIdx}
                      href={item.href || ""}
                      Icon={Icon}
                      title={item.title || ""}
                      isActive={pathname === item.href}
                      isCollapsed={isCollapsed}
                    />
                  );
                })}
              </div>

              {sectionIdx < navItems.length - 1 && (
                <Separator className="mt-4 opacity-50" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* ── User info ────────────────────────────────────────────────── */}
      <div
        className={cn(
          "border-t transition-all duration-200",
          isCollapsed ? "px-2 py-3" : "px-3 py-4",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center",
          )}
        >
          {/* Avatar */}
          <div
            title={isCollapsed ? userInfo?.name : undefined}
            className={cn(
              "relative flex shrink-0 items-center justify-center rounded-full",
              "bg-linear-to-br from-emerald-400 to-teal-500",
              "ring-2 ring-emerald-200 dark:ring-emerald-800/60",
              "transition-all duration-200",
              isCollapsed ? "size-8" : "size-9",
            )}
          >
            <span className="text-sm font-bold text-white">{userInitial}</span>
            {/* Active dot */}
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-sidebar bg-emerald-400" />
          </div>

          {/* Name + role */}
          <div
            className={cn(
              "min-w-0 flex-1 transition-all duration-200 origin-left",
              isCollapsed
                ? "w-0 opacity-0 overflow-hidden"
                : "w-auto opacity-100",
            )}
          >
            <p className="truncate text-sm font-semibold leading-tight text-foreground">
              {userInfo?.name}
            </p>
            <p className="mt-0.5 truncate text-[11px] capitalize text-emerald-600/70 dark:text-emerald-400/70 font-medium">
              {userRoleLabel}
            </p>
          </div>
        </div>
      </div>

      {/* ── Logout ───────────────────────────────────────────────────── */}
      <div
        className={cn(
          "border-t py-1.5",
          isCollapsed ? "px-2" : "px-1",
        )}
      >
        {isCollapsed ? (
          <CollapsedLogoutButton redirectTo="/login" />
        ) : (
          <LogoutButton
            className={cn(
              "text-red-500 hover:text-red-600 hover:bg-red-50",
              "dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30",
              "transition-colors duration-200 rounded-xl",
            )}
            redirectTo="/login"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardSidebarContent;
