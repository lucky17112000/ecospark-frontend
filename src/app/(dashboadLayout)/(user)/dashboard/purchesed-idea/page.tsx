import Purchesd from "@/components/modules/idea/Purchesd";
import { getUserPurchases } from "@/services/purchase.service";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

export const dynamic = "force-dynamic";

const PurchesdIdeaPage = async () => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["purchasedIdeas"],
      queryFn: () => getUserPurchases(),
    });
  } catch (error) {
    console.error("Purchased ideas prefetch skipped:", error);
  }
  return <Purchesd />;
};

export default PurchesdIdeaPage;
