import AllIdeas from "@/components/shared/Idea";
import { getIdea } from "@/services/idea.services";
import { getUserInfo } from "@/services/auth.service";
// import { getIdea } from "@/services/auth.service";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

const ideaPage = async () => {
  const queryClient = new QueryClient();
  const page = 0;
  const limit = 3;
  await queryClient.prefetchQuery({
    queryKey: ["idea", page, limit],
    queryFn: () => getIdea({ page, limit }),
  });

  const user = await getUserInfo();
  // const quryClient2 = new QueryClient();
  // // await quryClient2.prefetchQuery({
  // //   queryKey: ["deleteIdea"],
  // //   queryFn: deleteIdea,
  // // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    //   <IdeaList />
    // </HydrationBoundary>
    <AllIdeas user={user} />
  );
};

export default ideaPage;
