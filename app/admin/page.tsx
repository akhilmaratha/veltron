import NavigationDrawer from "@/components/navigation-drawer";
import BottomNavBar from "@/components/bottom-nav-bar";
import TopAppBar from "@/components/top-app-bar";
import StatCard from "@/components/commerce/stat-card";
import OrderRow from "@/components/commerce/order-row";
import { adminOrders, statCards } from "@/lib/commerce-data";

export default function AdminDashboardPage() {
  const monthlyBars = [42, 58, 50, 72, 96, 61, 38];

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationDrawer activeHref="/admin" />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopAppBar activeHref="/admin" showNavigation={false} title="Veltron" />
        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <section className="mb-12">
              <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Admin dashboard</p>
              <h1 className="mt-4 font-heading text-4xl text-text-primary sm:text-5xl">Performance Journal</h1>
              <p className="mt-4 max-w-2xl text-text-muted">
                A curated overview of sales, collector activity, and seasonal acquisition flow.
              </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </section>

            <section className="mt-12 rounded-lg border border-border bg-surface p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-heading text-3xl text-text-primary">Revenue Narrative</h2>
                  <p className="mt-2 text-sm text-text-muted">Monthly acquisition trends across all digital channels.</p>
                </div>
                <button className="w-fit rounded-md border border-border bg-background px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-text-primary">
                  Export CSV
                </button>
              </div>
              <div className="mt-10 grid h-72 grid-cols-7 items-end gap-3">
                {monthlyBars.map((height, index) => (
                  <div key={index} className="flex h-full flex-col justify-end">
                    <div
                      className={`rounded-t-md ${index === 4 ? "bg-primary" : "bg-primary/35"}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.22em] text-text-muted">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </section>

            <section className="mt-12 rounded-lg border border-border bg-background p-6 sm:p-8 lg:p-10">
              <h2 className="font-heading text-3xl text-text-primary">Recent Acquisitions</h2>
              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-[10px] uppercase tracking-[0.24em] text-text-muted">
                      <th className="pb-4 pr-4 font-semibold">Collector</th>
                      <th className="pb-4 pr-4 font-semibold">Item</th>
                      <th className="pb-4 pr-4 font-semibold">Price</th>
                      <th className="pb-4 pr-4 font-semibold">Status</th>
                      <th className="pb-4 pr-4 font-semibold">Date</th>
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
      <BottomNavBar activeHref="/admin" />
    </div>
  );
}