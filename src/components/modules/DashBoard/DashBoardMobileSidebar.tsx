"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetTitle } from "@/components/ui/sheet";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.type";
import { UserInfo } from "@/types/user.types";
import { Sprout } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardMobileSidebarProps {
  userInfo: UserInfo;
  navitems: NavSection[];
  dashBoardHome: string;
}

const DashboardMobileSidebar = ({
  userInfo,
  navitems,
  dashBoardHome,
}: DashboardMobileSidebarProps) => {
  const pathName = usePathname();
  const userInitial = userInfo?.name?.charAt(0).toUpperCase() ?? "?";
  const roleLabel = userInfo?.role?.toLowerCase().replace("_", " ") ?? "";

  return (
    <div className="flex h-full flex-col">
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

      {/* ── Brand header ─────────────────────────────────────────────── */}
      <div className="relative h-16 shrink-0 overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-700">
        {/* Decorative orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-4 size-16 rounded-full bg-white/10 blur-xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-2 left-1/3 size-10 rounded-full bg-teal-400/20 blur-lg"
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
          href={dashBoardHome}
          className="relative z-10 flex h-full items-center gap-2.5 px-5"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/20 backdrop-blur-sm">
            <Sprout className="size-4 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            EcoSpark
          </span>
        </Link>

        {/* Bottom shimmer */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent"
        />
      </div>

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-4">
          {navitems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600/70 dark:text-emerald-500/70">
                  {section.title}
                </h4>
              )}

              <div className="space-y-0.5">
                {section.items.map((item, id) => {
                  const isActive = pathName === item.href;
                  const Icon = getIconComponent(item.icon as string);
                  return (
                    <Link
                      href={item.href as string}
                      key={id}
                      className={cn(
                        "relative group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                        "transition-all duration-200",
                        isActive
                          ? [
                              "bg-emerald-50 text-emerald-700 shadow-sm",
                              "dark:bg-emerald-950/50 dark:text-emerald-300",
                            ]
                          : [
                              "text-muted-foreground",
                              "hover:bg-emerald-50/70 hover:text-emerald-700",
                              "dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400",
                            ],
                      )}
                    >
                      {/* Active bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-emerald-500" />
                      )}

                      <Icon
                        className={cn(
                          "size-4 shrink-0 transition-transform duration-200",
                          isActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "group-hover:scale-110 group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
                        )}
                      />
                      <span className="flex-1 truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>

              {sectionId < navitems.length - 1 && (
                <Separator className="mt-4 opacity-50" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* ── User info ────────────────────────────────────────────────── */}
      <div className="border-t px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 ring-2 ring-emerald-200 dark:ring-emerald-800/60">
            <span className="text-sm font-bold text-white">{userInitial}</span>
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight text-foreground">
              {userInfo?.name}
            </p>
            <p className="mt-0.5 truncate text-[11px] font-medium capitalize text-emerald-600/70 dark:text-emerald-400/70">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileSidebar;
