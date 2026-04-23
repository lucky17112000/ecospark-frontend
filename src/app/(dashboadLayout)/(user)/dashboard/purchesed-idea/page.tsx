"use server";
import Purchesd from "@/components/modules/idea/Purchesd";
import { getUserPurchases } from "@/services/purchase.service";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

const PurchesdIdeaPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["purchasedIdeas"],
    queryFn: () => getUserPurchases(),
  });
  return <Purchesd />;
};

export default PurchesdIdeaPage;
