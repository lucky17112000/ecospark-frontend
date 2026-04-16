import IdeaList from "@/components/modules/idea/IdeaList";
import { getIdea } from "@/services/auth.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const ideaPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["idea"],
    queryFn: getIdea,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IdeaList />
    </HydrationBoundary>
  );
};

export default ideaPage;
