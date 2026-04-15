import Link from "next/link";
import { Archive, House, ShoppingCart, UserRound } from "lucide-react";
import { bottomNavigationItems } from "@/lib/commerce-data";

interface BottomNavBarProps {
  activeHref?: string;
}

const iconMap = [House, Archive, ShoppingCart, UserRound] as const;

export default function BottomNavBar({ activeHref = "/" }: BottomNavBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-4 px-4">
        {bottomNavigationItems.map((item, index) => {
          const Icon = iconMap[index];
          const isActive = activeHref === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-[0.16em] transition ${
                isActive ? "border-t-2 border-primary text-primary" : "text-text-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}