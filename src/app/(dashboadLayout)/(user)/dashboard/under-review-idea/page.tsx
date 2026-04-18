import IdeaList from "@/components/modules/idea/IdeaList";
import { getIdea } from "@/services/idea.services";
// import { getIdea } from "@/services/auth.service";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

export const dynamic = "force-dynamic";

const UnderReviewPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["idea"],
    queryFn: getIdea,
  });

  return <IdeaList />;
};

export default UnderReviewPage;
