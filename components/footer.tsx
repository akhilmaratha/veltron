import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-text-primary px-6 py-16 text-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <h2 className="font-heading text-2xl">Veltron</h2>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-background/70">
            Premium electronics and refined objects for modern spaces.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            {
              label: "Products",
              links: [
                { label: "Homepage", href: "/" },
                { label: "Product Listing", href: "/product-listing" },
                { label: "Product Detail", href: "/product-detail" },
              ],
            },
            {
              label: "Support",
              links: [
                { label: "Checkout", href: "/checkout" },
                { label: "Cart", href: "/shopping-cart" },
                { label: "Wishlist", href: "/wishlist" },
              ],
            },
            {
              label: "Admin",
              links: [
                { label: "Dashboard", href: "/admin-dashboard" },
                { label: "Orders", href: "/order-management" },
                { label: "Inventory", href: "/product-management" },
              ],
            },
            {
              label: "Account",
              links: [
                { label: "Profile", href: "/user-profile" },
                { label: "Coupons", href: "/coupons" },
                { label: "Shipping", href: "/checkout" },
              ],
            },
          ].map((group) => (
            <div key={group.label}>
              <p className="text-xs uppercase tracking-[0.22em] text-primary">{group.label}</p>
              <div className="mt-4 flex flex-col gap-3 text-xs uppercase tracking-[0.2em] text-background/70">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} className="transition hover:text-background">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl text-[11px] uppercase tracking-[0.22em] text-background/50">
        © 2026 Veltron. All rights reserved.
      </div>
    </footer>
  );
}