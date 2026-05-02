"use server";
import LandingNavbar from "@/components/shared/LandingNavbar";
import LandingPage from "@/components/shared/LandingPage";
import { getLimitedIdea } from "@/services/idea.services";
import { QueryClient } from "@tanstack/react-query";

export default async function Home() {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["ideaLimit"],
      queryFn: () => getLimitedIdea(),
    });
  } catch (error) {
    console.error("Idea prefetch skipped:", error);
  }
  return (
    <div className="min-h-screen gap-6">
      {/* <LandingNavbar /> */}
      <LandingPage />
    </div>
  );
}
