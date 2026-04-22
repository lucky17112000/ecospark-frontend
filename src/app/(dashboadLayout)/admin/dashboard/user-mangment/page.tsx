import UserManagment from "@/components/modules/Admin-mangment/UserManagment";
import { getAllUserByAdmiAction } from "@/services/admin.service";
import { QueryClient } from "@tanstack/react-query";

import React from "react";

const userManagmentPage = async () => {
  const queryClient = new QueryClient();
  const page = 0;
  const limit = 3;
  await queryClient.prefetchQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getAllUserByAdmiAction({ page, limit }),
  });
  return <UserManagment />;
};

export default userManagmentPage;
