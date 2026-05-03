"use server";
import UserAnalytic from "@/components/modules/idea/userAnalytics/UserAnalytic";
import { getAdminIndividualUserStatsAction } from "@/services/admin.service";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

const UserDashBoard = async () => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["userDashboardData"],
      queryFn: () => getAdminIndividualUserStatsAction(),
    });
  } catch (error) {
    console.error("User dashboard prefetch skipped:", error);
  }
  return <UserAnalytic />;
};

export default UserDashBoard;
