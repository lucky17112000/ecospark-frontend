// localhost:5000/api/v1/vote
"use server";

import { httpClient } from "@/lib/axios/httpClient";

type CastVotePayload = { ideaId: string; voteType: "UP" | "DOWN" };

export const castVote = async (payload: CastVotePayload): Promise<unknown> => {
  try {
    const response = await httpClient.post<unknown>("/vote", {
      ideaId: payload.ideaId,
      type: payload.voteType,
    });
    return response;
  } catch (error) {
    console.error("Error casting vote:", error);
    throw error;
  }
};
