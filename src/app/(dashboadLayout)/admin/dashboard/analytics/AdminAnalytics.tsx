"use client";

import { BarChart } from "@/components/modules/Admin-mangment/analytics/BarChart";
import { DonutChart } from "@/components/modules/Admin-mangment/analytics/DonutChart";
import { KPICard } from "@/components/modules/Admin-mangment/analytics/KPICard";
import { QuickInsights } from "@/components/modules/Admin-mangment/analytics/QuickInsights";
import { QuickStats } from "@/components/modules/Admin-mangment/analytics/QuickStats";
import { RecentActivity } from "@/components/modules/Admin-mangment/analytics/RecentActivity";
import { getAdminDashboardStatsAction } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, ShieldCheck, Users2 } from "lucide-react";

const AdminAnalytics = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminDashboardData"],
    queryFn: () => getAdminDashboardStatsAction(),
  });

  const stats = data?.data;

  const totalUsers = stats?.totalUsers ?? 0;
  const totalAdmins = stats?.totalAdmins ?? 0;
  const totalEnergy = stats?.totalEnergyIdeas ?? 0;
  const totalPlastic = stats?.totalPlasticIdeas ?? 0;
  const totalTree = stats?.totalTreeIdeas ?? 0;
  const totalOthers = stats?.totalOthersIdeas ?? 0;
  const totalIdeas = totalEnergy + totalPlastic + totalTree + totalOthers;

  /* ── KPI card config ─────────────────────────────────────────────────── */
  const kpiCards = [
    {
      title: "Total Creators",
      value: totalUsers,
      icon: Users2,
      trend: "+12% this month",
      trendUp: true,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      delay: "animate-delay-100",
    },
    {
      title: "Total Admins",
      value: totalAdmins,
      icon: ShieldCheck,
      trend: "+2 new this week",
      trendUp: true,
      iconBg: "bg-blue-50 dark:bg-blue-950/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      delay: "animate-delay-200",
    },
    {
      title: "Total Ideas",
      value: totalIdeas,
      icon: Lightbulb,
      trend: "+34 this month",
      trendUp: true,
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      iconColor: "text-amber-600 dark:text-amber-400",
      delay: "animate-delay-300",
    },
  ];

  /* ── Donut chart data ─────────────────────────────────────────────────── */
  const donutData = [
    { label: "Creators", value: totalUsers, color: "#10b981" },
    { label: "Admins", value: totalAdmins, color: "#3b82f6" },
  ];

  /* ── Bar chart data ───────────────────────────────────────────────────── */
  const barData = [
    { label: "Energy", value: totalEnergy, color: "#d97706", lightColor: "#fbbf24" },
    { label: "Plastic", value: totalPlastic, color: "#2563eb", lightColor: "#60a5fa" },
    { label: "Tree", value: totalTree, color: "#059669", lightColor: "#34d399" },
    { label: "Others", value: totalOthers, color: "#7c3aed", lightColor: "#a78bfa" },
  ];

  /* ── Quick insights data ─────────────────────────────────────────────── */
  const insightCategories = [
    { label: "Energy", value: totalEnergy, color: "#f59e0b" },
    { label: "Plastic", value: totalPlastic, color: "#3b82f6" },
    { label: "Tree", value: totalTree, color: "#10b981" },
    { label: "Others", value: totalOthers, color: "#8b5cf6" },
  ];

  /* ── Quick stats data ─────────────────────────────────────────────────── */
  const quickStatsItems = [
    { label: "Energy Ideas", value: totalEnergy, total: totalIdeas, color: "#f59e0b" },
    { label: "Plastic Ideas", value: totalPlastic, total: totalIdeas, color: "#3b82f6" },
    { label: "Tree Ideas", value: totalTree, total: totalIdeas, color: "#10b981" },
    { label: "Others Ideas", value: totalOthers, total: totalIdeas, color: "#8b5cf6" },
  ];

  /* ── Loading skeleton ─────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-destructive">
          Failed to load analytics data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="animate-eco-fade-down">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform statistics and activity at a glance.
        </p>
      </div>

      {/* ── KPI cards ───────────────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {kpiCards.map((card) => (
            <KPICard
              key={card.title}
              title={card.title}
              value={card.value}
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

      {/* ── Charts ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="animate-eco-fade-in animate-delay-300 mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Charts
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DonutChart
            title="User Distribution"
            data={donutData}
            animationDelay="animate-delay-400"
          />
          <BarChart
            title="Ideas Overview"
            data={barData}
            animationDelay="animate-delay-500"
          />
        </div>
      </section>

      {/* ── Quick insights ──────────────────────────────────────────────── */}
      <section>
        <QuickInsights
          categories={insightCategories}
          animationDelay="animate-delay-500"
        />
      </section>

      {/* ── Quick stats + Recent activity ───────────────────────────────── */}
      <section>
        <h2 className="animate-eco-fade-in animate-delay-500 mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Details
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <QuickStats
            title="Idea Breakdown"
            items={quickStatsItems}
            animationDelay="animate-delay-600"
          />
          <RecentActivity animationDelay="animate-delay-700" />
        </div>
      </section>
    </div>
  );
};

export default AdminAnalytics;
