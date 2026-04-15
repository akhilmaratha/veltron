import Image from "next/image";
import type { OrderRowData } from "@/types/commerce";
import StatusBadge from "./status-badge";

interface OrderRowProps {
  order: OrderRowData;
}

export default function OrderRow({ order }: OrderRowProps) {
  return (
    <tr className="border-b border-border/60 transition hover:bg-surface/70">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-surface">
            <Image src={order.avatar} alt={order.customer} fill sizes="40px" className="object-cover" />
          </div>
          <span className="font-medium text-text-primary">{order.customer}</span>
        </div>
      </td>
      <td className="py-4 pr-4 text-text-muted">{order.product}</td>
      <td className="py-4 pr-4 font-medium text-text-primary">{order.price}</td>
      <td className="py-4 pr-4">
        <StatusBadge status={order.status} />
      </td>
      <td className="py-4 pr-4 text-text-muted">{order.date}</td>
    </tr>
  );
}