// import { UserInfo } from "os";
"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetTitle } from "@/components/ui/sheet";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.type";
// import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";
import { keyof } from "zod";

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
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href={dashBoardHome}>
          <span className="text-xl font-bold text-primary">PH HelthCare</span>
        </Link>
      </div>
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
      {/* navigation area */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navitems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">
                  {section.title}
                </h4>
              )}
              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathName === item.href;
                  const Icon = getIconComponent(item.icon as string);
                  return (
                    <Link
                      href={item.href as string}
                      key={id}
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "transparent hover:bg-accent hover:accent-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
              {sectionId < navitems.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* userInfo */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {/* if profile picture is available, display it instead  */}
            <span className="text-sm font-medium text-primary">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{userInfo.name}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">
              {userInfo.role.toLocaleLowerCase().replace("-", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileSidebar;
