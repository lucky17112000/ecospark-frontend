"use client";

import { IdeaDetailView } from "@/components/shared/IdeaDetailView";
import { Skeleton } from "@/components/ui/skeleton";
import { getIdea, getIdeaById } from "@/services/idea.services";
import { createPurchaseAction } from "@/services/purchase.service";
import { castVote } from "@/services/vote.service";
import type { ApiResponse } from "@/types/api.types";
import type { IIdeaResponse } from "@/types/idea.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, LeafIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type VoteRecordLike = { userId?: unknown; type?: unknown; voteType?: unknown };
type PurchaseRecordLike = { userId?: unknown; paymentStatus?: unknown };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getVoteUserIdFromRecord = (vote: unknown): string | null => {
  if (!vote || typeof vote !== "object") return null;
  const r = vote as VoteRecordLike;
  return typeof r.userId === "string" ? r.userId : null;
};

const getVoteTypeFromRecord = (vote: unknown): "UP" | "DOWN" | null => {
  if (!vote || typeof vote !== "object") return null;
  const r = vote as VoteRecordLike;
  const t = r.type ?? r.voteType;
  return t === "UP" || t === "DOWN" ? t : null;
};

const isIdeaPurchasedByUser = (
  idea: IIdeaResponse | null,
  userId: string,
): boolean => {
  if (!idea?.isPaid) return false;
  const purchases = (idea as unknown as { purchases?: unknown }).purchases;
  if (!Array.isArray(purchases) || purchases.length === 0) return false;
  return purchases.some((p) => {
    if (!p || typeof p !== "object") return false;
    const r = p as PurchaseRecordLike;
    if (r.paymentStatus !== "PAID") return false;
    return typeof r.userId === "string" ? r.userId === userId : true;
  });
};

// ─── Fetch: try direct endpoint, fall back to list search ─────────────────────

const fetchIdeaById = async (
  id: string,
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<ApiResponse<IIdeaResponse>> => {
  // 1. Check all cached idea list queries first
  const cached = queryClient.getQueriesData<ApiResponse<IIdeaResponse[]>>({
    queryKey: ["idea"],
  });
  for (const [, response] of cached) {
    const found = response?.data?.find((i) => i.id === id);
    if (found) return { success: true, message: "ok", data: found };
  }

  // 2. Try dedicated GET /idea/:id endpoint
  try {
    return await getIdeaById(id);
  } catch {
    // 3. Fallback: fetch list and search by id
    const list = await getIdea({ page: 1, limit: 50, status: "APPROVED" });
    const found = list?.data?.find((i) => i.id === id);
    if (found) return { success: true, message: "ok", data: found };
    throw new Error("Idea not found.");
  }
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const DetailSkeleton = () => (
  <div className="w-full animate-pulse">
    <Skeleton className="h-72 w-full rounded-none sm:h-96" />
    <div className="mx-auto w-full max-w-4xl space-y-5 px-4 py-8 sm:px-6">
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-48 w-full rounded-2xl" />
      ))}
    </div>
  </div>
);

// ─── Error state ──────────────────────────────────────────────────────────────

const DetailError = ({ message }: { message: string }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
      <LeafIcon className="h-8 w-8 text-emerald-400" />
    </div>
    <div className="space-y-1">
      <p className="text-base font-semibold">Could not load idea</p>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
    <Link
      href="/idea"
      className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
    >
      <ArrowLeftIcon className="h-3.5 w-3.5" />
      Back to Ideas
    </Link>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const IdeaDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const ideaId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  const [userId] = useState<string>("");
  const [duplicateVoteMsg, setDuplicateVoteMsg] = useState("");
  const [voteError, setVoteError] = useState("");

  const {
    data: ideaResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["idea-detail", ideaId],
    // staleTime: cache seeded by Idea.tsx is considered fresh for 60 s,
    // so if user navigated from the list the skeleton never flashes.
    staleTime: 60_000,
    queryFn: () => fetchIdeaById(ideaId, queryClient),
    enabled: !!ideaId,
    retry: false,
  });

  const idea = ideaResponse?.data ?? null;
  const isPurchased = idea ? isIdeaPurchasedByUser(idea, userId) : false;

  const { mutateAsync: vote, isPending: isVoting } = useMutation({
    mutationFn: (payload: { ideaId: string; voteType: "UP" | "DOWN" }) =>
      castVote(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["idea-detail", ideaId] }),
  });

  const { mutate: purchase, isPending: isPurchasePending } = useMutation({
    mutationFn: createPurchaseAction,
    onSuccess: (res) => {
      const url = res?.data?.sessionUrl;
      if (typeof url === "string" && url.length > 0) {
        window.location.assign(url);
      }
    },
  });

  const handleVote = async (voteType: "UP" | "DOWN") => {
    if (!idea?.id) return;
    setVoteError("");

    if (
      userId &&
      Array.isArray((idea as unknown as { votes?: unknown }).votes)
    ) {
      const votes = (idea as unknown as { votes: unknown[] }).votes;
      const existing = votes.find((v) => getVoteUserIdFromRecord(v) === userId);
      if (existing && getVoteTypeFromRecord(existing) === voteType) {
        setDuplicateVoteMsg(
          "You have already voted for this idea with the same type.",
        );
        return;
      }
    }

    try {
      await vote({ ideaId: idea.id, voteType });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to cast vote.";
      if (msg.toLowerCase().includes("already voted")) {
        setDuplicateVoteMsg(msg);
      } else {
        setVoteError(msg);
      }
    }
  };

  const handlePurchase = () => {
    if (!idea?.id) return;
    if (isPurchased) {
      router.push("/dashboard/purchesed-idea");
      return;
    }
    purchase({ ideaId: idea.id });
  };

  if (isLoading) return <DetailSkeleton />;

  if (isError || !idea)
    return (
      <DetailError
        message={error instanceof Error ? error.message : "Idea not found."}
      />
    );

  return (
    <>
      {duplicateVoteMsg && (
        <div
          role="alert"
          onClick={() => setDuplicateVoteMsg("")}
          className="fixed inset-x-0 top-0 z-50 cursor-pointer bg-amber-500 px-4 py-3 text-center text-sm font-medium text-white shadow-lg transition-all duration-300 hover:bg-amber-600"
        >
          {duplicateVoteMsg} — click to dismiss
        </div>
      )}

      <IdeaDetailView
        idea={idea}
        isPurchased={isPurchased}
        onVote={handleVote}
        onPurchase={handlePurchase}
        isVoting={isVoting}
        isPurchasePending={isPurchasePending}
        voteError={voteError}
        backHref="/idea"
      />
    </>
  );
};

export default IdeaDetailPage;
