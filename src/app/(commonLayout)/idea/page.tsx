import IdeaList from "@/components/modules/idea/IdeaList";
import AllIdeas from "@/components/shared/Idea";
import { getIdea } from "@/services/idea.services";
// import { getIdea } from "@/services/auth.service";
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
  // const quryClient2 = new QueryClient();
  // // await quryClient2.prefetchQuery({
  // //   queryKey: ["deleteIdea"],
  // //   queryFn: deleteIdea,
  // // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    //   <IdeaList />
    // </HydrationBoundary>
    <AllIdeas />
  );
};

export default ideaPage;
