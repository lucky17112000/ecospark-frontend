// import { getDashboardRoute } from "@/lib/authUtiles";
// import { getCommonNavItems, getNavItemsByRole } from "@/lib/navItems";
// import { getUserInfo } from "@/services/auth.services";
// import { NavSection } from "@/types/dashboard.types";
// import React from "react";
// import DashBoardSidebarContent from "./DashBoardSidebarContent";

import { getDashboardRoute } from "@/lib/authUtiles";
import { getNavItemsByRole } from "@/lib/navItems";
import { getUserInfo } from "@/services/auth.service";
import DashboardSidebarContent from "./DashboardSidebarContent";

const DashboardSidebar = async () => {
  // const navItems: NavSection[] = getCommonNavItems(userInfo.role);
  const userInfo = await getUserInfo();
  console.log("User Info in DashboardSidebar:", userInfo); // Debug log to check user info
  const navItems = getNavItemsByRole(userInfo.role);
  const dashBoardHome = getDashboardRoute(userInfo.role);

  return (
    <DashboardSidebarContent
      dashboardHome={dashBoardHome}
      navItems={navItems}
      userInfo={userInfo}
    />
  );
};

export default DashboardSidebar;
