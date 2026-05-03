import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info, Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface Insight {
  icon: LucideIcon;
  text: string;
  iconColor: string;
  bg: string;
}

function buildInsights(
  totalIdeas: number,
  approvedIdeas: number,
  totalVotes: number,
  upVotes: number,
): Insight[] {
  const insights: Insight[] = [];
  const approvalRate = totalIdeas > 0 ? (approvedIdeas / totalIdeas) * 100 : 0;
  const upVotePct = totalVotes > 0 ? (upVotes / totalVotes) * 100 : 0;

  if (totalIdeas === 0) {
    insights.push({
      icon: Lightbulb,
      text: "Start submitting ideas to see your analytics here!",
      iconColor: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    });
    return insights;
  }

  if (approvalRate >= 70) {
    insights.push({
      icon: TrendingUp,
      text: `Your approval rate is ${approvalRate.toFixed(0)}%  — excellent work!`,
      iconColor: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    });
  } else if (approvalRate >= 40) {
    insights.push({
      icon: Info,
      text: `Your approval rate is ${approvalRate.toFixed(0)}% — keep refining your ideas.`,
      iconColor: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    });
  } else {
    insights.push({
      icon: TrendingDown,
      text: `Approval rate is ${approvalRate.toFixed(0)}% — focus on quality over quantity.`,
      iconColor: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/30",
    });
  }

  if (totalVotes === 0) {
    insights.push({
      icon: Lightbulb,
      text: "No votes yet — share your ideas with the community to get feedback!",
      iconColor: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    });
  } else if (upVotePct >= 80) {
    insights.push({
      icon: TrendingUp,
      text: `${upVotePct.toFixed(0)}% of your votes are positive — the community loves your ideas!`,
      iconColor: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    });
  } else if (totalVotes >= 10) {
    insights.push({
      icon: TrendingUp,
      text: "You have strong engagement from the community!",
      iconColor: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    });
  }

  const rejected = totalIdeas - approvedIdeas;
  if (rejected > 0 && approvedIdeas > 0) {
    insights.push({
      icon: Info,
      text: `${rejected} idea${rejected > 1 ? "s" : ""} pending or rejected — review for improvements.`,
      iconColor: "text-muted-foreground",
      bg: "bg-muted/50",
    });
  }

  return insights;
}

interface UserInsightsProps {
  totalIdeas: number;
  approvedIdeas: number;
  totalVotes: number;
  upVotes: number;
  animationDelay?: string;
}

export function UserInsights({
  totalIdeas,
  approvedIdeas,
  totalVotes,
  upVotes,
  animationDelay = "",
}: UserInsightsProps) {
  const insights = buildInsights(
    totalIdeas,
    approvedIdeas,
    totalVotes,
    upVotes,
  );

  return (
    <div className={`animate-eco-fade-up ${animationDelay}`}>
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Smart Insights</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-5">
          {insights.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 rounded-xl p-4",
                  insight.bg,
                )}
              >
                <Icon
                  className={cn("mt-0.5 h-4 w-4 shrink-0", insight.iconColor)}
                />
                <p className="text-sm leading-relaxed">{insight.text}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
