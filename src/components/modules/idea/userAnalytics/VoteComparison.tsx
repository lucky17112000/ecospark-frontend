"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThumbsDown, ThumbsUp } from "lucide-react";

interface VoteComparisonProps {
  upVotes: number;
  downVotes: number;
  animationDelay?: string;
}

export function VoteComparison({
  upVotes,
  downVotes,
  animationDelay = "",
}: VoteComparisonProps) {
  const total = upVotes + downVotes;
  const upPct = total > 0 ? (upVotes / total) * 100 : 50;
  const downPct = 100 - upPct;

  return (
    <div className={`animate-eco-fade-up ${animationDelay}`}>
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="text-base">Vote Analysis</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 pt-6">
          {/* Split percentage bar */}
          <div className="flex flex-col gap-2">
            <div className="flex h-10 w-full overflow-hidden rounded-xl">
              <div
                className="flex items-center justify-center text-sm font-semibold text-white transition-all duration-1000"
                style={{
                  width: `${upPct}%`,
                  background: "linear-gradient(to right, #059669, #34d399)",
                  minWidth: upPct > 0 ? "2.5rem" : "0",
                }}
              >
                {upPct > 8 ? `${upPct.toFixed(0)}%` : ""}
              </div>
              <div
                className="flex items-center justify-center text-sm font-semibold text-white transition-all duration-1000"
                style={{
                  width: `${downPct}%`,
                  background: "linear-gradient(to right, #dc2626, #f87171)",
                  minWidth: downPct > 0 ? "2.5rem" : "0",
                }}
              >
                {downPct > 8 ? `${downPct.toFixed(0)}%` : ""}
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Upvotes</span>
              <span>Downvotes</span>
            </div>
          </div>

          {/* Count tiles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Up Votes
                </span>
              </div>
              <span className="text-3xl font-bold tabular-nums text-emerald-600">
                {upVotes.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-xl bg-rose-50 p-4 dark:bg-rose-950/30">
              <div className="flex items-center gap-2">
                <ThumbsDown className="h-4 w-4 text-rose-600" />
                <span className="text-xs font-medium text-rose-700 dark:text-rose-400">
                  Down Votes
                </span>
              </div>
              <span className="text-3xl font-bold tabular-nums text-rose-600">
                {downVotes.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Total */}
          {total > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              {total.toLocaleString()} total votes received
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
