import Link from "next/link";
import { BarChart3, LayoutGrid, Package, ScanSearch, Settings, ShoppingCart } from "lucide-react";

interface NavigationDrawerProps {
  activeHref?: string;
}

const adminNavigation = [
  { label: "Inventory", href: "/product-management", icon: LayoutGrid },
  { label: "Sales", href: "/order-management", icon: ShoppingCart },
  { label: "Analytics", href: "/admin-dashboard", icon: BarChart3 },
  { label: "Curation", href: "/product-listing", icon: ScanSearch },
  { label: "Settings", href: "/user-profile", icon: Settings },
] as const;

export default function NavigationDrawer({ activeHref = "/admin-dashboard" }: NavigationDrawerProps) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-text-primary px-8 py-8 text-background lg:flex">
      <p className="font-heading text-2xl italic text-background/90">Admin Console</p>
      <nav className="mt-10 flex flex-col gap-2">
        {adminNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeHref === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-r-full px-4 py-4 text-sm transition ${
                isActive ? "bg-primary text-background" : "text-background/70 hover:bg-primary/10 hover:text-background"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-8 text-xs uppercase tracking-[0.2em] text-background/40">
        <Package className="mb-4 h-5 w-5" />
      </div>
    </aside>
  );
}