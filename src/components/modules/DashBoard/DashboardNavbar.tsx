// import { getDashboardRoute } from "@/lib/authUtiles";
// import { getNavItemsByRole } from "@/lib/navItems";
// import { getUserInfo } from "@/services/auth.services";

import React from "react";
import DashboardNavbarContent from "./DashBoardNavbarContent";
import { getUserInfo } from "@/services/auth.service";
import { getNavItemsByRole } from "@/lib/navItems";
import { getDashboardRoute } from "@/lib/authUtiles";
// import DashboardNavbarContent from "./DashboardNavbarContnt";

const DashboardNavbar = async () => {
  const userInfo = await getUserInfo();
  const navItems = getNavItemsByRole(userInfo.role);
  const dashBoardHome = getDashboardRoute(userInfo.role);
  return (
    <DashboardNavbarContent
      userInfo={userInfo}
      navItems={navItems}
      dashBoardHome={dashBoardHome}
    />
  );
};

export default DashboardNavbar;
