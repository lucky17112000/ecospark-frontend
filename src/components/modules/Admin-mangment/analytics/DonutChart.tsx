"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  data: DonutSegment[];
  animationDelay?: string;
}

const VB = 280;
const CX = VB / 2;
const CY = VB / 2;
const R = 108;
const SW = 32;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function DonutChart({ title, data, animationDelay = "" }: DonutChartProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(id);
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const segments = data.reduce(
    (acc, d) => {
      const dash = total > 0 ? (d.value / total) * CIRCUMFERENCE : 0;
      const offset =
        acc.length > 0
          ? acc[acc.length - 1].offset + acc[acc.length - 1].dash
          : 0;
      return [
        ...acc,
        {
          ...d,
          dash,
          offset,
          percentage: total > 0 ? ((d.value / total) * 100).toFixed(1) : "0",
        },
      ];
    },
    [] as Array<DonutSegment & { dash: number; offset: number; percentage: string }>,
  );

  const hovered = hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <div className={`animate-eco-fade-up ${animationDelay}`}>
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 pb-6 pt-6">
          {/* SVG donut */}
          <div className="w-full max-w-[300px] sm:max-w-[340px]">
            <svg
              viewBox={`0 0 ${VB} ${VB}`}
              width="100%"
              aria-label={title}
              style={{ display: "block" }}
            >
              {/* Track ring */}
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke="currentColor"
                strokeWidth={SW}
                className="text-muted/30"
              />

              {/* Segments — animate dash from 0 on mount */}
              {segments.map((seg, i) => (
                <circle
                  key={i}
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={SW + (hoveredIndex === i ? 6 : 0)}
                  strokeDasharray={
                    mounted
                      ? `${seg.dash} ${CIRCUMFERENCE}`
                      : `0 ${CIRCUMFERENCE}`
                  }
                  strokeDashoffset={-seg.offset}
                  transform={`rotate(-90 ${CX} ${CY})`}
                  strokeLinecap="butt"
                  className="cursor-pointer"
                  style={{
                    transition:
                      "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1), stroke-width 0.2s ease",
                    transitionDelay: mounted ? `${i * 120}ms` : "0ms",
                    filter:
                      hoveredIndex === i
                        ? `drop-shadow(0 0 6px ${seg.color}88)`
                        : "none",
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              ))}

              {/* Centre — swaps to segment detail on hover */}
              {hovered ? (
                <>
                  <text
                    x={CX}
                    y={CY - 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="13"
                    className="fill-muted-foreground"
                    letterSpacing="0.5"
                  >
                    {hovered.label.toUpperCase()}
                  </text>
                  <text
                    x={CX}
                    y={CY + 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="36"
                    fontWeight="800"
                    fill={hovered.color}
                  >
                    {hovered.value}
                  </text>
                  <text
                    x={CX}
                    y={CY + 34}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="13"
                    fontWeight="600"
                    fill={hovered.color}
                  >
                    {hovered.percentage}%
                  </text>
                </>
              ) : (
                <>
                  <text
                    x={CX}
                    y={CY - 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="38"
                    fontWeight="800"
                    className="fill-foreground"
                  >
                    {total}
                  </text>
                  <text
                    x={CX}
                    y={CY + 18}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="13"
                    className="fill-muted-foreground"
                    letterSpacing="1"
                  >
                    TOTAL
                  </text>
                </>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex w-full max-w-xs flex-col gap-3">
            {segments.map((seg, i) => (
              <div
                key={seg.label}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 transition-colors duration-150"
                style={{
                  background:
                    hoveredIndex === i ? `${seg.color}18` : "transparent",
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full transition-transform duration-150"
                  style={{
                    background: seg.color,
                    transform: hoveredIndex === i ? "scale(1.4)" : "scale(1)",
                  }}
                />
                <span className="flex-1 text-sm text-muted-foreground">
                  {seg.label}
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {seg.value}
                </span>
                <span className="w-14 text-right text-xs font-medium text-muted-foreground">
                  {seg.percentage}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
