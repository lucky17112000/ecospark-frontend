"use client";

import { DonutChart } from "@/components/modules/Admin-mangment/analytics/DonutChart";
import { KPICard } from "@/components/modules/Admin-mangment/analytics/KPICard";
import { VoteComparison } from "@/components/modules/idea/userAnalytics/VoteComparison";
import { UserInsights } from "@/components/modules/idea/userAnalytics/UserInsights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminIndividualUserStatsAction } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  FileText,
  Star,
  ThumbsUp,
} from "lucide-react";

const UserAnalytic = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userDashboardData"],
    queryFn: () => getAdminIndividualUserStatsAction(),
  });

  const stats = data?.data;

  const totalIdeas = stats?.totalIdeas ?? 0;
  const approvedIdeas = stats?.approvedIdeas ?? 0;
  const totalVotes = stats?.totalVotes ?? 0;
  const totalUpVotes = stats?.totalUpVotes ?? 0;
  const totalDownVotes = stats?.totalDownVotes ?? 0;
  const rejectedIdeas = totalIdeas - approvedIdeas;
  const approvalRate =
    totalIdeas > 0 ? Math.round((approvedIdeas / totalIdeas) * 100) : 0;

  /* ── KPI card config ─────────────────────────────────────────────────── */
  const kpiCards = [
    {
      title: "Total Ideas",
      value: totalIdeas,
      icon: FileText,
      trend: "All submitted ideas",
      trendUp: true,
      iconBg: "bg-blue-50 dark:bg-blue-950/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      delay: "animate-delay-100",
    },
    {
      title: "Approved Ideas",
      value: approvedIdeas,
      icon: CheckCircle,
      trend: `${rejectedIdeas} pending / rejected`,
      trendUp: true,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      delay: "animate-delay-200",
    },
    {
      title: "Total Votes",
      value: totalVotes,
      icon: ThumbsUp,
      trend: "Community engagement",
      trendUp: true,
      iconBg: "bg-violet-50 dark:bg-violet-950/40",
      iconColor: "text-violet-600 dark:text-violet-400",
      delay: "animate-delay-300",
    },
    {
      title: "Approval Rate",
      value: approvalRate,
      suffix: "%",
      icon: Star,
      trend:
        approvalRate >= 70
          ? "Excellent performance"
          : approvalRate >= 40
            ? "Room to improve"
            : "Focus on quality",
      trendUp: approvalRate >= 50,
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      iconColor: "text-amber-600 dark:text-amber-400",
      delay: "animate-delay-400",
    },
  ];

  /* ── Donut chart data ─────────────────────────────────────────────────── */
  const donutData = [
    { label: "Approved", value: approvedIdeas, color: "#10b981" },
    { label: "Rejected", value: rejectedIdeas, color: "#f43f5e" },
  ];

  /* ── Approval rate progress ───────────────────────────────────────────── */
  const progressPct = approvalRate;

  /* ── Loading state ────────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading your analytics…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-destructive">
          Failed to load analytics. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="animate-eco-fade-down">
        <h1 className="text-2xl font-bold tracking-tight">My Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your ideas, votes, and engagement.
        </p>
      </div>

      {/* ── KPI cards ───────────────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((card) => (
            <KPICard
              key={card.title}
              title={card.title}
              value={card.value}
              suffix={"suffix" in card ? (card.suffix as string) : ""}
              icon={card.icon}
              trend={card.trend}
              trendUp={card.trendUp}
              iconBg={card.iconBg}
              iconColor={card.iconColor}
              animationDelay={card.delay}
            />
          ))}
        </div>
      </section>

      {/* ── Approval rate progress ──────────────────────────────────────── */}
      <section>
        <div className="animate-eco-fade-up animate-delay-400">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Approval Rate Progress</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
                {/* Big percentage */}
                <div className="shrink-0 text-center sm:text-left">
                  <p className="text-6xl font-black tabular-nums leading-none">
                    {progressPct}
                    <span className="text-3xl font-bold text-muted-foreground">
                      %
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {approvedIdeas} of {totalIdeas} ideas approved
                  </p>
                </div>

                {/* Progress bar + breakdown */}
                <div className="flex flex-1 flex-col gap-4">
                  <div className="h-4 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${progressPct}%`,
                        background:
                          "linear-gradient(to right, #059669, #34d399)",
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-950/30">
                      <p className="text-xl font-bold tabular-nums text-emerald-600">
                        {approvedIdeas}
                      </p>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                    <div className="rounded-xl bg-rose-50 p-3 text-center dark:bg-rose-950/30">
                      <p className="text-xl font-bold tabular-nums text-rose-500">
                        {rejectedIdeas}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rejected / Pending
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Charts ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="animate-eco-fade-in animate-delay-400 mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Charts
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DonutChart
            title="Idea Status Distribution"
            data={donutData}
            animationDelay="animate-delay-500"
          />
          <VoteComparison
            upVotes={totalUpVotes}
            downVotes={totalDownVotes}
            animationDelay="animate-delay-600"
          />
        </div>
      </section>

      {/* ── Smart insights ──────────────────────────────────────────────── */}
      <section>
        <UserInsights
          totalIdeas={totalIdeas}
          approvedIdeas={approvedIdeas}
          totalVotes={totalVotes}
          upVotes={totalUpVotes}
          animationDelay="animate-delay-700"
        />
      </section>
    </div>
  );
};

export default UserAnalytic;
