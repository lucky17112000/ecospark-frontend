"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useCountUp } from "./useCountUp";

interface KPICardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  iconBg: string;
  iconColor: string;
  animationDelay?: string;
}

export function KPICard({
  title,
  value,
  suffix = "",
  icon: Icon,
  trend,
  trendUp = true,
  iconBg,
  iconColor,
  animationDelay = "",
}: KPICardProps) {
  const animatedValue = useCountUp(value);

  return (
    <div className={cn("animate-eco-fade-up", animationDelay)}>
      <Card className="group cursor-default transition-all duration-300 hover:scale-[1.03] hover:shadow-lg">
        <CardContent className="flex items-start justify-between gap-4 pt-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className="text-4xl font-bold tracking-tight tabular-nums">
              {animatedValue.toLocaleString()}{suffix}
            </p>
            {trend && (
              <p
                className={cn(
                  "mt-0.5 text-xs font-medium",
                  trendUp
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-500"
                )}
              >
                {trend}
              </p>
            )}
          </div>
          <div className={cn("mt-1 shrink-0 rounded-2xl p-3", iconBg)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
