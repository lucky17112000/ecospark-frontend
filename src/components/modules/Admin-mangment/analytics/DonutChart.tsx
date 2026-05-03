"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

// Viewbox is 280×280 — SVG scales responsively via CSS width
const VB = 280;
const CX = VB / 2;   // 140
const CY = VB / 2;   // 140
const R = 108;        // outer radius
const SW = 32;        // stroke width (ring thickness)
const CIRCUMFERENCE = 2 * Math.PI * R;

export function DonutChart({
  title,
  data,
  animationDelay = "",
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const segments = data.reduce(
    (acc, d) => {
      const dash = total > 0 ? (d.value / total) * CIRCUMFERENCE : 0;
      const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
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
    [] as Array<DonutSegment & { dash: number; offset: number; percentage: string }>
  );

  return (
    <div className={`animate-eco-fade-up ${animationDelay}`}>
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 pt-6 pb-6">
          {/* ── Responsive SVG donut ── */}
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

              {/* Coloured segments */}
              {segments.map((seg, i) => (
                <circle
                  key={i}
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={SW}
                  strokeDasharray={`${seg.dash} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-seg.offset}
                  transform={`rotate(-90 ${CX} ${CY})`}
                  strokeLinecap="butt"
                />
              ))}

              {/* Centre — total count */}
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
                TOTAL USERS
              </text>
            </svg>
          </div>

          {/* ── Legend ── */}
          <div className="flex w-full max-w-xs flex-col gap-3">
            {segments.map((seg) => (
              <div key={seg.label} className="flex items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: seg.color }}
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
