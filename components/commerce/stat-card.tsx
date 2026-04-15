import type { StatCardData } from "@/types/commerce";

interface StatCardProps {
  stat: StatCardData;
}

export default function StatCard({ stat }: StatCardProps) {
  const trendColor = stat.direction === "down" ? "text-danger" : "text-success";

  return (
    <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
      <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted">{stat.label}</p>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-heading text-3xl text-primary">{stat.value}</span>
        <span className={`text-xs font-semibold ${trendColor}`}>{stat.trend}</span>
      </div>
    </div>
  );
}