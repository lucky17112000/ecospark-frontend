"use server";

import { getAdminDashboardStatsAction } from "@/services/admin.service";
import { QueryClient } from "@tanstack/react-query";
import AdminAnalytics from "./analytics/AdminAnalytics";

export default async function AdminDashboardPage() {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["adminDashboardData"],
      queryFn: () => getAdminDashboardStatsAction(),
    });
  } catch (error) {
    console.error("Admin dashboard prefetch skipped:", error);
  }
  return <AdminAnalytics />;
}
