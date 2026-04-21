"use server";
import { getIdea2 } from "@/services/idea.services";
import { QueryClient, useQuery } from "@tanstack/react-query";

import ChangePassword from "../change-password/page";

const frorgotPasswordPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["idea"],
    queryFn: getIdea2,
  });
  return <ChangePassword />;
};

export default frorgotPasswordPage;
