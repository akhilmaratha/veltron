import NavigationDrawer from "@/components/navigation-drawer";
import BottomNavBar from "@/components/bottom-nav-bar";
import TopAppBar from "@/components/top-app-bar";
import OrderRow from "@/components/commerce/order-row";
import { adminOrders } from "@/lib/commerce-data";

const orderTabs = ["All Orders", "Pending", "Processing", "Shipped", "Returned"] as const;

export default function OrderManagementPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <NavigationDrawer activeHref="/order-management" />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopAppBar activeHref="/order-management" showNavigation={false} title="Veltron" />
        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <section className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Admin operations</p>
              <h1 className="mt-4 font-heading text-4xl text-text-primary sm:text-5xl">Order Management</h1>
            </section>

            <div className="flex flex-wrap gap-3 border-b border-border pb-6 text-[10px] uppercase tracking-[0.24em] text-text-muted">
              {orderTabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`rounded-full px-4 py-2 transition ${index === 0 ? 'bg-primary text-background' : 'bg-surface text-text-muted'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <section className="mt-8 rounded-lg border border-border bg-background p-6 sm:p-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-[10px] uppercase tracking-[0.24em] text-text-muted">
                      <th className="pb-4 pr-4 font-semibold">Customer</th>
                      <th className="pb-4 pr-4 font-semibold">Product</th>
                      <th className="pb-4 pr-4 font-semibold">Value</th>
                      <th className="pb-4 pr-4 font-semibold">Status</th>
                      <th className="pb-4 pr-4 font-semibold">Placed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminOrders.map((order) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
      <BottomNavBar activeHref="/order-management" />
    </div>
  );
}