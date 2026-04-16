import Link from "next/link";
import { ArrowLeft, Settings, Layout, ShoppingCart, Users, PanelTop, Tags } from "lucide-react";

interface NavigationDrawerProps {
  activeHref?: string;
}

const adminNavigation = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Layout },
  { label: "Products", href: "/admin/products", icon: Layout },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Homepage CMS", href: "/admin/content/homepage", icon: PanelTop },
  { label: "Category CMS", href: "/admin/content/categories", icon: Tags },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

export default function NavigationDrawer({ activeHref = "/admin" }: NavigationDrawerProps) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-text-primary px-8 py-8 text-background lg:flex">
      <p className="font-heading text-lg font-black text-background/90 uppercase tracking-tighter">Atelier</p>
      
      <div className="mt-8 rounded-xl border border-background/15 bg-background/5 p-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">AP</div>
          <div>
            <p className="text-sm font-semibold text-background">Admin Panel</p>
            <p className="text-xs uppercase tracking-wider text-background/70">Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-1">
        {adminNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeHref === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                isActive ? "bg-background/20 text-background border-r-2 border-primary" : "text-background/70 hover:bg-background/10 hover:text-background"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <Link
        href="/"
        className="mt-auto inline-flex items-center gap-3 rounded-lg border border-background/15 bg-background/5 px-4 py-3 text-xs uppercase tracking-wider text-background/80 transition hover:bg-background/10 hover:text-background"
      >
        <ArrowLeft className="h-4 w-4" />
        View Storefront
      </Link>
      
      <div className="mt-6 pt-6 border-t border-background/10 text-xs uppercase tracking-widest text-background/40">
        v1.0.2
      </div>
    </aside>
  );
}