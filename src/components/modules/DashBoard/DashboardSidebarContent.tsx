"use client";

import LogoutButton from "@/components/shared/LogoutButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/services/auth.service";
import { NavSection } from "@/types/dashboard.type";
import { UserInfo } from "@/types/user.types";
import { ChevronLeft, ChevronRight, Leaf, LogOut } from "lucide-react";
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

// ─── Sub-components ───────────────────────────────────────────────────────────

const SidebarNavItem = ({ href, Icon, title, isActive, isCollapsed }: NavItemProps) => (
  <Link
    href={href}
    title={isCollapsed ? title : undefined}
    className={cn(
      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
      "transition-all duration-200 ease-in-out",
      isCollapsed && "justify-center px-0",
      isActive
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    )}
  >
    <Icon
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        !isActive && "group-hover:scale-110"
      )}
    />
    <span
      className={cn(
        "truncate transition-all duration-200 origin-left",
        isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
      )}
    >
      {title}
    </span>
  </Link>
);

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
        "flex w-full justify-center rounded-lg p-2.5",
        "text-destructive transition-all duration-200",
        "hover:bg-destructive/10 active:scale-95",
        loading && "opacity-50 cursor-not-allowed"
      )}
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

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
        "hidden md:flex h-full flex-col border-r bg-card relative",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-17" : "w-64"
      )}
    >
      {/* ── Collapse / Expand Toggle ── */}
      <button
        onClick={() => setIsCollapsed((prev) => !prev)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute -right-3 top-18 z-20",
          "flex h-6 w-6 items-center justify-center rounded-full",
          "border border-border bg-card shadow-md",
          "text-muted-foreground hover:text-foreground hover:border-primary/40 hover:shadow-lg",
          "transition-all duration-200 active:scale-90"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* ── Logo / Brand ── */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b",
          isCollapsed ? "justify-center px-3" : "px-5 gap-2.5"
        )}
      >
        <Link
          href={dashboardHome}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <Leaf
            className={cn(
              "shrink-0 text-primary transition-all duration-200",
              isCollapsed ? "h-6 w-6" : "h-5 w-5"
            )}
          />
          <span
            className={cn(
              "text-xl font-bold text-primary whitespace-nowrap",
              "transition-all duration-200 origin-left",
              isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            )}
          >
            EcoSpark
          </span>
        </Link>
      </div>

      {/* ── Navigation Sections ── */}
      <ScrollArea className="flex-1 py-3">
        <nav className={cn("space-y-4", isCollapsed ? "px-2" : "px-3")}>
          {navItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {/* Section heading */}
              {section.title && (
                <div
                  className={cn(
                    "transition-all duration-200 overflow-hidden",
                    isCollapsed ? "h-0 mb-0 opacity-0" : "h-auto mb-1.5 opacity-100"
                  )}
                >
                  <h4 className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
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
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* ── User Info ── */}
      <div
        className={cn(
          "border-t transition-all duration-200",
          isCollapsed ? "px-2 py-3" : "px-3 py-4"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <div
            title={isCollapsed ? userInfo?.name : undefined}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full",
              "bg-primary/10 ring-2 ring-primary/20",
              "transition-all duration-200",
              isCollapsed ? "h-8 w-8" : "h-9 w-9"
            )}
          >
            <span className="text-sm font-bold text-primary">{userInitial}</span>
          </div>

          <div
            className={cn(
              "flex-1 min-w-0 transition-all duration-200 origin-left",
              isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            )}
          >
            <p className="text-sm font-semibold truncate leading-tight">
              {userInfo?.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">
              {userRoleLabel}
            </p>
          </div>
        </div>
      </div>

      {/* ── Logout ── */}
      <Separator />
      <div className={cn("py-1", isCollapsed ? "px-2" : "px-1")}>
        {isCollapsed ? (
          <CollapsedLogoutButton redirectTo="/login" />
        ) : (
          <LogoutButton
            className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
            redirectTo="/login"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardSidebarContent;
