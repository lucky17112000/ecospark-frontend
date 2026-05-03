import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle, Trophy } from "lucide-react";

interface CategoryEntry {
  label: string;
  value: number;
  color: string;
}

interface QuickInsightsProps {
  categories: CategoryEntry[];
  animationDelay?: string;
}

export function QuickInsights({
  categories,
  animationDelay = "",
}: QuickInsightsProps) {
  if (categories.length === 0) return null;

  const sorted = [...categories].sort((a, b) => b.value - a.value);
  const most = sorted[0];
  const least = sorted[sorted.length - 1];

  return (
    <div className={`animate-eco-fade-up ${animationDelay}`}>
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Quick Insights</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2">
          {/* Most popular */}
          <InsightTile
            icon={Trophy}
            iconBg="bg-amber-50 dark:bg-amber-950/30"
            iconColor="text-amber-500"
            badge="Most Popular"
            badgeColor="text-amber-600 dark:text-amber-400"
            label={most.label}
            value={most.value}
            accentColor={most.color}
          />

          {/* Least popular */}
          <InsightTile
            icon={AlertCircle}
            iconBg="bg-rose-50 dark:bg-rose-950/30"
            iconColor="text-rose-500"
            badge="Least Popular"
            badgeColor="text-rose-500"
            label={least.label}
            value={least.value}
            accentColor={least.color}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Internal tile ─────────────────────────────────────────────────────── */

interface InsightTileProps {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeColor: string;
  label: string;
  value: number;
  accentColor: string;
}

function InsightTile({
  icon: Icon,
  iconBg,
  iconColor,
  badge,
  badgeColor,
  label,
  value,
  accentColor,
}: InsightTileProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border p-4 transition-colors duration-150 hover:bg-muted/30">
      <div className={cn("shrink-0 rounded-xl p-2.5", iconBg)}>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className={cn("text-xs font-semibold uppercase tracking-wide", badgeColor)}>
          {badge}
        </span>
        <span className="text-base font-bold">{label} Ideas</span>
        <span
          className="mt-0.5 text-2xl font-extrabold tabular-nums"
          style={{ color: accentColor }}
        >
          {value.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
