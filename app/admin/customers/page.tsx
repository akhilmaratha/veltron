'use client';

import Link from "next/link";
import { ChevronLeft, ChevronRight, Filter, Plus, TrendingUp } from "lucide-react";
import NavigationDrawer from "@/components/navigation-drawer";
import BottomNavBar from "@/components/bottom-nav-bar";

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpend: number;
  status: 'ACTIVE' | 'BLOCKED';
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Elena Vance',
    email: 'elena.v@digitalatelier.com',
    orders: 42,
    totalSpend: 12450.0,
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Julian Rossi',
    email: 'j.rossi@arch-studio.io',
    orders: 18,
    totalSpend: 4820.5,
    status: 'ACTIVE',
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    email: 's.jenkins@vogue.co.uk',
    orders: 5,
    totalSpend: 2100.0,
    status: 'BLOCKED',
  },
  {
    id: '4',
    name: 'Marcus Thorne',
    email: 'marcus@thorne-design.com',
    orders: 124,
    totalSpend: 38912.0,
    status: 'ACTIVE',
  },
];

export default function AdminCustomersPage() {
  return (
    <div className="flex min-h-screen bg-[#0b1326]">
      <NavigationDrawer activeHref="/admin/customers" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-[#464554]/15 bg-[#0b1326]/70 px-8 py-4 shadow-[0px_20px_40px_rgba(6,14,32,0.6)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h1 className="font-headline text-lg font-bold uppercase tracking-[-0.02em] text-[#dae2fd]">Customer Relations</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-lg border border-[#464554]/30 px-4 py-2 text-[0.6875rem] font-medium uppercase tracking-wider text-[#c7c4d7] transition-colors hover:border-[#464554]/50 hover:text-[#dae2fd]">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-[#c0c1ff] px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-wider text-[#07006c] transition-colors hover:bg-[#c0c1ff]/90">
              <Plus className="h-4 w-4" />
              Add New Customer
            </button>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          <p className="mb-8 text-[0.6875rem] font-medium uppercase tracking-wider text-[#c7c4d7]">Administration</p>

          <div className="mb-8 overflow-hidden rounded-2xl bg-[#131b2e]">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-0">
                <thead>
                  <tr className="border-b border-[#464554]/15">
                    <th className="px-8 py-4 text-left text-[0.6875rem] font-bold uppercase tracking-widest text-[#c7c4d7]">Customer Identity</th>
                    <th className="px-8 py-4 text-left text-[0.6875rem] font-bold uppercase tracking-widest text-[#c7c4d7]">Volume</th>
                    <th className="px-8 py-4 text-left text-[0.6875rem] font-bold uppercase tracking-widest text-[#c7c4d7]">Total Spend</th>
                    <th className="px-8 py-4 text-left text-[0.6875rem] font-bold uppercase tracking-widest text-[#c7c4d7]">Status</th>
                    <th className="px-8 py-4 text-right text-[0.6875rem] font-bold uppercase tracking-widest text-[#c7c4d7]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-[#464554]/15 transition-colors hover:bg-[#222a3d]/50">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-xs font-bold text-[#07006c]">
                            {customer.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#dae2fd]">{customer.name}</p>
                            <p className="text-[0.6875rem] text-[#c7c4d7]">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-semibold text-[#dae2fd]">{customer.orders} Orders</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-[#dae2fd]">${customer.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            customer.status === 'ACTIVE'
                              ? 'border border-[#4ade80]/30 bg-[#1e6b4a]/20 text-[#4ade80]'
                              : 'border border-[#ff7875]/30 bg-[#7f1d1d]/20 text-[#ff7875]'
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="text-[0.6875rem] font-bold uppercase tracking-wider text-[#c0c1ff] transition-colors hover:text-[#dae2fd]"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#464554]/15 px-8 py-6">
              <p className="text-[0.6875rem] font-medium uppercase tracking-wider text-[#c7c4d7]">Showing 1-4 of 1,280 customers</p>
              <div className="flex items-center gap-2">
                <button className="rounded-lg p-2 text-[#c7c4d7] transition-colors hover:bg-[#222a3d] hover:text-[#dae2fd]">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-2 text-[#c7c4d7] transition-colors hover:bg-[#222a3d] hover:text-[#dae2fd]">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-[#131b2e] p-8">
              <p className="mb-6 text-[0.6875rem] font-bold uppercase tracking-widest text-[#c7c4d7]">Engagement Rate</p>
              <div className="mb-6">
                <p className="mb-1 text-3xl font-bold text-[#dae2fd]">84.2%</p>
                <p className="flex items-center gap-1 text-[0.6875rem] font-bold text-[#4ade80]">
                  <TrendingUp className="h-3 w-3" /> +2.4%
                </p>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-[#222a3d]">
                <div className="h-full w-[84%] bg-gradient-to-r from-[#c0c1ff] to-[#8083ff]" />
              </div>
            </div>

            <div className="rounded-2xl bg-[#131b2e] p-8">
              <p className="mb-6 text-[0.6875rem] font-bold uppercase tracking-widest text-[#c7c4d7]">Average Order Value</p>
              <div className="mb-6">
                <p className="mb-1 text-3xl font-bold text-[#dae2fd]">$1,420</p>
                <p className="flex items-center gap-1 text-[0.6875rem] font-bold text-[#ffb783]">
                  <TrendingUp className="h-3 w-3" /> +$85
                </p>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-[#222a3d]">
                <div className="h-full w-[72%] bg-gradient-to-r from-[#c0c1ff] to-[#8083ff]" />
              </div>
            </div>

            <div className="rounded-2xl bg-[#131b2e] p-8">
              <p className="mb-6 text-[0.6875rem] font-bold uppercase tracking-widest text-[#c7c4d7]">Retention Index</p>
              <div className="mb-6">
                <p className="mb-1 text-3xl font-bold text-[#dae2fd]">92/100</p>
                <p className="text-[0.6875rem] font-bold text-[#c7c4d7]">Stable</p>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-[#222a3d]">
                <div className="h-full w-[92%] bg-gradient-to-r from-[#c0c1ff] to-[#8083ff]" />
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNavBar activeHref="/admin/customers" />
    </div>
  );
}
