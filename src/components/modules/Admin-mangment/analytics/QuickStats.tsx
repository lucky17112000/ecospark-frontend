import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatItem {
  label: string;
  value: number;
  total: number;
  color: string;
}

interface QuickStatsProps {
  title: string;
  items: StatItem[];
  animationDelay?: string;
}

export function QuickStats({
  title,
  items,
  animationDelay = "",
}: QuickStatsProps) {
  return (
    <div className={`animate-eco-fade-up ${animationDelay}`}>
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pt-5">
          {items.map((item) => {
            const pct =
              item.total > 0
                ? ((item.value / item.total) * 100).toFixed(1)
                : "0";
            return (
              <div key={item.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{item.value}</span>
                    <span className="w-12 text-right text-xs text-muted-foreground">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%`, background: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
