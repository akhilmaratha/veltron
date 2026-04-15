import Image from "next/image";
import type { ProfilePurchaseData } from "@/types/commerce";

interface ProfileAcquisitionRowProps {
  purchase: ProfilePurchaseData;
}

export default function ProfileAcquisitionRow({ purchase }: ProfileAcquisitionRowProps) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-border/70 py-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 overflow-hidden rounded bg-surface">
          <Image src={purchase.image} alt={purchase.title} fill sizes="44px" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">{purchase.title}</p>
          <p className="text-xs uppercase tracking-[0.22em] text-text-muted">{purchase.date}</p>
        </div>
      </div>
      <span className="font-heading text-lg text-text-primary">{purchase.value}</span>
    </li>
  );
}