"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BarData {
  label: string;
  value: number;
  color: string;
  lightColor: string;
}

interface BarChartProps {
  title: string;
  data: BarData[];
  animationDelay?: string;
}

export function BarChart({
  title,
  data,
  animationDelay = "",
}: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`animate-eco-fade-up ${animationDelay}`}>
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Bars */}
          <div className="flex h-48 items-end justify-around gap-3">
            {data.map((d) => {
              const heightPct = Math.max((d.value / max) * 100, 3);
              return (
                <div
                  key={d.label}
                  className="group flex flex-1 flex-col items-center gap-1"
                >
                  {/* Value — visible on hover */}
                  <span className="text-xs font-semibold opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    {d.value}
                  </span>
                  {/* Bar column */}
                  <div className="flex w-full items-end" style={{ height: "160px" }}>
                    <div
                      className="w-full cursor-pointer rounded-t-lg transition-all duration-700 group-hover:brightness-110"
                      style={{
                        height: `${heightPct}%`,
                        background: `linear-gradient(to top, ${d.color}, ${d.lightColor})`,
                      }}
                    />
                  </div>
                  {/* Label */}
                  <span className="text-xs font-medium text-muted-foreground">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Value row */}
          <div className="mt-2 flex justify-around">
            {data.map((d) => (
              <span
                key={d.label}
                className="flex-1 text-center text-xs font-bold"
              >
                {d.value}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
