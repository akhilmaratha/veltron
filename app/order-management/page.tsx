"use client";

import { useEffect, useState } from "react";
import NavigationDrawer from "@/components/navigation-drawer";
import BottomNavBar from "@/components/bottom-nav-bar";
import TopAppBar from "@/components/top-app-bar";
import StatusBadge from "@/components/commerce/status-badge";

const orderTabs = ["All Orders", "Paid", "Packed", "Shipped", "Delivered"] as const;
const orderStatusMap = {
  "All Orders": "all",
  "Paid": "paid",
  "Packed": "packed",
  "Shipped": "shipped",
  "Delivered": "delivered",
};

interface Order {
  id: string;
  orderId: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  shippingMethod: string;
  itemCount: number;
  createdAt: string;
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<typeof orderTabs[number]>("All Orders");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const statusValue = orderStatusMap[selectedTab];
        const response = await fetch(`/api/orders?status=${statusValue}`);

        const payload = (await response.json()) as {
          items?: Order[];
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Unable to load orders.");
        }

        setOrders(payload.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, [selectedTab]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(orderId);

      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const payload = (await response.json()) as {
        paymentStatus?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to update order.");
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? { ...order, paymentStatus: payload.paymentStatus ?? newStatus }
            : order,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update order.");
    } finally {
      setUpdating(null);
    }
  };

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
              {orderTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`rounded-full px-4 py-2 transition ${selectedTab === tab ? 'bg-primary text-background' : 'bg-surface text-text-muted hover:bg-surface/70'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <section className="mt-8 rounded-lg border border-border bg-background p-6 sm:p-8">
              {loading ? <p className="mb-4 text-sm text-text-muted">Loading orders...</p> : null}
              {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-[10px] uppercase tracking-[0.24em] text-text-muted">
                      <th className="pb-4 pr-4 font-semibold">Order ID</th>
                      <th className="pb-4 pr-4 font-semibold">Customer</th>
                      <th className="pb-4 pr-4 font-semibold">Amount</th>
                      <th className="pb-4 pr-4 font-semibold">Items</th>
                      <th className="pb-4 pr-4 font-semibold">Status</th>
                      <th className="pb-4 pr-4 font-semibold">Shipping</th>
                      <th className="pb-4 pr-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border/60 hover:bg-surface/70">
                        <td className="py-4 pr-4 text-sm font-medium text-text-primary">{order.orderId.slice(-8)}</td>
                        <td className="py-4 pr-4">
                          <div className="text-sm">
                            <p className="font-medium text-text-primary">{order.customerName}</p>
                            <p className="text-xs text-text-muted">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="py-4 pr-4 font-medium text-text-primary">{order.currency} {order.amount.toFixed(2)}</td>
                        <td className="py-4 pr-4 text-sm text-text-muted">{order.itemCount} item(s)</td>
                        <td className="py-4 pr-4">
                          <StatusBadge
                            status={
                              order.paymentStatus === "paid"
                                ? "Active"
                                : order.paymentStatus === "packed"
                                  ? "Processing"
                                  : order.paymentStatus === "shipped"
                                    ? "Shipped"
                                    : order.paymentStatus === "delivered"
                                      ? "Delivered"
                                      : "Pending"
                            }
                          />
                        </td>
                        <td className="py-4 pr-4 text-sm text-text-muted capitalize">{order.shippingMethod}</td>
                        <td className="py-4 pr-4">
                          <div className="flex flex-wrap gap-1">
                            {order.paymentStatus === "paid" ? (
                              <button
                                onClick={() => {
                                  void updateOrderStatus(order.id, "packed");
                                }}
                                disabled={updating === order.id}
                                className="rounded bg-primary px-2 py-1 text-xs text-background hover:bg-primary/90 disabled:opacity-60"
                              >
                                Pack
                              </button>
                            ) : null}
                            {order.paymentStatus === "packed" ? (
                              <button
                                onClick={() => {
                                  void updateOrderStatus(order.id, "shipped");
                                }}
                                disabled={updating === order.id}
                                className="rounded bg-primary px-2 py-1 text-xs text-background hover:bg-primary/90 disabled:opacity-60"
                              >
                                Ship
                              </button>
                            ) : null}
                            {order.paymentStatus === "shipped" ? (
                              <button
                                onClick={() => {
                                  void updateOrderStatus(order.id, "delivered");
                                }}
                                disabled={updating === order.id}
                                className="rounded bg-primary px-2 py-1 text-xs text-background hover:bg-primary/90 disabled:opacity-60"
                              >
                                Deliver
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && !loading ? (
                  <p className="mt-4 text-sm text-text-muted">No orders found.</p>
                ) : null}
              </div>
            </section>
          </div>
        </main>
      </div>
      <BottomNavBar activeHref="/order-management" />
    </div>
  );
}