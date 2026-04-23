import UserManagment from "@/components/modules/Admin-mangment/UserManagment";
import { getAllUserByAdmiAction } from "@/services/admin.service";
import { QueryClient } from "@tanstack/react-query";

import React from "react";

export const dynamic = "force-dynamic";

const userManagmentPage = async () => {
  const queryClient = new QueryClient();
  const page = 0;
  const limit = 3;
  try {
    await queryClient.prefetchQuery({
      queryKey: ["users", page, limit],
      queryFn: () => getAllUserByAdmiAction({ page, limit }),
    });
  } catch (error) {
    console.error("Users prefetch skipped:", error);
  }
  return <UserManagment />;
};

export default userManagmentPage;
