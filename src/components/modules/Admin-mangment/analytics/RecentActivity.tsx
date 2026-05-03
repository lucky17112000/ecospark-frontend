import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Lightbulb, Star, TreePine, UserPlus, Zap } from "lucide-react";

const ACTIVITIES = [
  {
    icon: Lightbulb,
    label: "New energy idea submitted",
    time: "2 min ago",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: UserPlus,
    label: "New creator registered",
    time: "15 min ago",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: Star,
    label: "Idea marked as featured",
    time: "1 hr ago",
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    icon: TreePine,
    label: "Tree planting idea approved",
    time: "3 hr ago",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: CheckCircle,
    label: "Plastic reduction idea verified",
    time: "4 hr ago",
    color: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-950/30",
  },
  {
    icon: Zap,
    label: "Others idea trending",
    time: "6 hr ago",
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
] as const;

interface RecentActivityProps {
  animationDelay?: string;
}

export function RecentActivity({ animationDelay = "" }: RecentActivityProps) {
  return (
    <div className={`animate-eco-fade-up ${animationDelay}`}>
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y pt-0">
          {ACTIVITIES.map((a, i) => {
            const Icon = a.icon;
            return (
              <div
                key={i}
                className="-mx-1 flex items-center gap-4 rounded-lg px-1 py-3 transition-colors duration-150 hover:bg-muted/40"
              >
                <div className={`shrink-0 rounded-xl p-2 ${a.bg}`}>
                  <Icon className={`h-4 w-4 ${a.color}`} />
                </div>
                <p className="flex-1 truncate text-sm font-medium">{a.label}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {a.time}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
