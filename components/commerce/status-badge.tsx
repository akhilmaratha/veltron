import type { OrderStatus } from "@/types/commerce";

interface StatusBadgeProps {
  status: OrderStatus | string;
}

const statusClasses: Record<string, string> = {
  Delivered: "bg-success/10 text-success",
  Processing: "bg-warning/10 text-warning",
  Pending: "bg-warning/10 text-warning",
  Shipped: "bg-primary/10 text-primary",
  Returned: "bg-danger/10 text-danger",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${statusClasses[status] ?? "bg-surface text-text-muted"}`}>
      {status}
    </span>
  );
}