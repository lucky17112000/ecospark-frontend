"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavSection } from "@/types/dashboard.type";
import { UserInfo } from "@/types/user.types";
import { Menu, Search } from "lucide-react";
// import { Button } from "@base-ui/react";
import { useState } from "react";
import DashboardMobileSidebar from "./DashBoardMobileSidebar";
import UserDropDown from "./UserDropDown";

// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { NavSection } from "@/types/dashboard.types";
// import { UserInfo } from "@/types/user.types";
// import { Menu, Search } from "lucide-react";

// import React, { useEffect, useState } from "react";
// import DashboardMobileSidebar from "./DashboardMobileSidebar";
// import { Input } from "@/components/ui/input";
// import NotificatinDropDown from "./NotificatinDropDown";
// import UserDropDown from "./UserDropDown";
interface DashboardnavnarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashBoardHome: string;
}

const DashboardNavbarContent = ({
  userInfo,
  navItems,
  dashBoardHome,
}: DashboardnavnarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const sheetOpen = isMobile && isOpen;

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card px-4 md:px-6">
      {/* Mobile menu Toggle Button */}
      <Sheet open={sheetOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant={"outline"} size={"icon"}>
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <DashboardMobileSidebar
            userInfo={userInfo}
            navitems={navItems}
            dashBoardHome={dashBoardHome}
          />
        </SheetContent>
      </Sheet>

      {/* search component */}
      <div className="flex min-w-0 flex-1 items-center">
        <div className="relative hidden w-full sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
          <Input type="text" placeholder="Search..." className="pl-9 pr-4" />
        </div>
      </div>

      {/* right side actions */}
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {/* Notification */}
        {/* <NotificatinDropDown /> */}
        {/* user dropdown */}
        <UserDropDown userInfo={userInfo} />
      </div>
    </header>
  );
};

export default DashboardNavbarContent;
