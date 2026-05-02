import AllIdeas from "@/components/shared/Idea";
import { getIdea } from "@/services/idea.services";
import { getUserInfo } from "@/services/auth.service";
// import { getIdea } from "@/services/auth.service";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

export const dynamic = "force-dynamic";

const ideaPage = async () => {
  const queryClient = new QueryClient();
  const page = 1;
  const limit = 3;
  try {
    await queryClient.prefetchQuery({
      queryKey: ["idea", page, limit],
      queryFn: () => getIdea({ page, limit, status: "APPROVED" }),
    });
  } catch (error) {
    console.error("Idea prefetch skipped:", error);
  }

  const user = await getUserInfo().catch(() => ({
    id: "",
    email: "",
    role: "",
    needPasswordChange: false,
  }));
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
