"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

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

const BAR_HEIGHT = 180;

export function BarChart({ title, data, animationDelay = "" }: BarChartProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(id);
  }, []);

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`animate-eco-fade-up ${animationDelay}`}>
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Bar grid */}
          <div
            className="flex items-end justify-around gap-3"
            style={{ height: `${BAR_HEIGHT}px` }}
          >
            {data.map((d, i) => {
              const targetPct = Math.max((d.value / max) * 100, 2);
              const isHovered = hoveredIndex === i;

              return (
                <div
                  key={d.label}
                  className="relative flex flex-1 flex-col items-center"
                  style={{ height: "100%" }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Floating tooltip */}
                  <div
                    className="pointer-events-none absolute z-10 -translate-x-1/2 left-1/2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-200"
                    style={{
                      background: d.color,
                      bottom: `${mounted ? (targetPct / 100) * BAR_HEIGHT + 10 : 10}px`,
                      opacity: isHovered ? 1 : 0,
                      transform: `translateX(-50%) ${isHovered ? "translateY(0) scale(1)" : "translateY(6px) scale(0.92)"}`,
                      transition: "opacity 0.18s ease, transform 0.18s ease, bottom 0s",
                    }}
                  >
                    {d.label}: {d.value}
                    {/* Arrow */}
                    <span
                      className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
                      style={{ borderTopColor: d.color }}
                    />
                  </div>

                  {/* Bar wrapper — aligns bar to bottom */}
                  <div
                    className="flex w-full items-end"
                    style={{ height: "100%" }}
                  >
                    {/* Progress line overlay */}
                    <div className="relative w-full overflow-hidden rounded-t-lg">
                      {/* Bar */}
                      <div
                        className="w-full rounded-t-lg"
                        style={{
                          height: mounted ? `${(targetPct / 100) * BAR_HEIGHT}px` : "0px",
                          background: `linear-gradient(to top, ${d.color}, ${d.lightColor})`,
                          transition: `height 0.85s cubic-bezier(0.16,1,0.3,1)`,
                          transitionDelay: `${i * 100}ms`,
                          filter: isHovered
                            ? `drop-shadow(0 -4px 8px ${d.color}88)`
                            : "none",
                          transform: isHovered ? "scaleX(1.04)" : "scaleX(1)",
                          transformOrigin: "bottom",
                        }}
                      />

                      {/* Animated shimmer progress line at top of bar */}
                      {mounted && (
                        <div
                          className="absolute left-0 right-0 top-0 h-0.75 rounded-full"
                          style={{
                            background: `linear-gradient(to right, transparent, ${d.lightColor}, transparent)`,
                            animation: "eco-shimmer 2s ease-in-out infinite",
                            animationDelay: `${i * 200}ms`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Label + value row */}
          <div className="mt-4 flex justify-around gap-3">
            {data.map((d, i) => (
              <div
                key={d.label}
                className="flex flex-1 cursor-default flex-col items-center gap-0.5"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span
                  className="text-sm font-bold tabular-nums transition-colors duration-150"
                  style={{ color: hoveredIndex === i ? d.color : undefined }}
                >
                  {d.value}
                </span>
                <span className="text-xs text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
