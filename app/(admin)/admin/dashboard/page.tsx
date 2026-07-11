"use client";

import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import Toggle from "@/components/toggle";

// ── Mock Data ──────────────────────────────────────────

const stats = [
  {
    label: "Total Products",
    value: "1,284",
    change: "+12.5%",
    up: true,
    icon: Package,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Total Orders",
    value: "3,572",
    change: "+8.2%",
    up: true,
    icon: ShoppingBag,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Revenue",
    value: "$48,290",
    change: "+23.1%",
    up: true,
    icon: DollarSign,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "Total Users",
    value: "6,841",
    change: "-3.4%",
    up: false,
    icon: Users,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const recentOrders = [
  {
    id: "#ORD-7842",
    customer: "Amara Okafor",
    product: "Adire Print Blazer",
    amount: "$129.00",
    status: "Delivered" as const,
    date: "2 min ago",
  },
  {
    id: "#ORD-7841",
    customer: "Chidi Eze",
    product: "Kente Street Hoodie",
    amount: "$89.00",
    status: "Processing" as const,
    date: "15 min ago",
  },
  {
    id: "#ORD-7840",
    customer: "Zara Bello",
    product: "Dashiki Midi Dress",
    amount: "$159.00",
    status: "Shipped" as const,
    date: "1 hr ago",
  },
  {
    id: "#ORD-7839",
    customer: "Kofi Mensah",
    product: " Ankara Bomber Jacket",
    amount: "$210.00",
    status: "Pending" as const,
    date: "3 hrs ago",
  },
  {
    id: "#ORD-7838",
    customer: "Ngozi Adeyemi",
    product: "Batik Wide-Leg Pants",
    amount: "$74.00",
    status: "Delivered" as const,
    date: "5 hrs ago",
  },
];

const topProducts = [
  { name: "Adire Print Blazer", sales: 342, revenue: "$44,118" },
  { name: "Kente Street Hoodie", sales: 289, revenue: "$25,721" },
  { name: "Dashiki Midi Dress", sales: 256, revenue: "$40,704" },
  { name: "Ankara Bomber Jacket", sales: 198, revenue: "$41,580" },
  { name: "Batik Wide-Leg Pants", sales: 167, revenue: "$12,358" },
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Processing: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Shipped: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Pending: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
};

// ── Component ──────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-medium text-cloud sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-0.5 text-xs text-cloud/50 sm:mt-1 sm:text-sm">
            Welcome back, Admin. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cloud/40" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border border-black/10 bg-white/80 py-2 pl-9 pr-3 text-sm text-cloud placeholder:text-cloud/40 focus:outline-none focus:ring-2 focus:ring-accent dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50 sm:w-56"
            />
          </div>

          <div className="hidden sm:block">
            <Toggle />
          </div>

          {/* Admin Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent sm:h-9 sm:w-9 sm:text-sm">
            A
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm transition hover:shadow-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl ${stat.bg} p-2.5`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.up ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {stat.up ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="mt-3 text-xl font-semibold text-cloud sm:mt-4 sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-cloud/50 sm:mt-1 sm:text-sm">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Main Grid: Recent Orders + Top Products ── */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-cloud">
              Recent Orders
            </h2>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-medium text-accent transition hover:text-accent/80"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 text-xs uppercase tracking-wider text-cloud/40 dark:border-[rgba(244,244,242,0.08)]">
                  <th className="pb-3 pr-4 font-medium">Order</th>
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Product</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-black/5 last:border-0 dark:border-[rgba(244,244,242,0.05)]"
                  >
                    <td className="py-3 pr-4 font-medium text-cloud">
                      {order.id}
                    </td>
                    <td className="py-3 pr-4 text-cloud/70">
                      {order.customer}
                    </td>
                    <td className="py-3 pr-4 text-cloud/70">{order.product}</td>
                    <td className="py-3 pr-4 font-medium text-cloud">
                      {order.amount}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          statusStyles[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-cloud/50">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile order cards */}
          <div className="space-y-3 sm:hidden">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-black/10 bg-white/60 p-3.5 dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/40"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-cloud">
                    {order.id}
                  </span>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      statusStyles[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-cloud/80">{order.customer}</p>
                <p className="text-xs text-cloud/50">{order.product}</p>
                <div className="mt-2 flex items-center justify-between border-t border-black/5 pt-2 dark:border-[rgba(244,244,242,0.05)]">
                  <span className="text-sm font-medium text-cloud">
                    {order.amount}
                  </span>
                  <span className="text-xs text-cloud/50">{order.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-cloud">
              Top Products
            </h2>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-cloud/40 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/5 text-xs font-medium text-cloud/60 dark:bg-white/5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-cloud">
                    {product.name}
                  </p>
                  <p className="text-xs text-cloud/50">{product.sales} sales</p>
                </div>
                <span className="shrink-0 text-sm font-medium text-cloud">
                  {product.revenue}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-cloud/50">
              <span>Monthly Goal</span>
              <span>68%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: "68%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
        {[
          {
            label: "Add New Product",
            desc: "List a new item in your catalog",
            icon: Package,
          },
          {
            label: "View All Orders",
            desc: "Check pending and completed orders",
            icon: ShoppingBag,
          },
          {
            label: "Recent Activity",
            desc: "See what&apos;s happening on your store",
            icon: Clock,
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white/80 p-4 text-left backdrop-blur-sm transition hover:border-accent/30 hover:shadow-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60 dark:hover:border-accent/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 transition group-hover:bg-accent/20">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-cloud">{action.label}</p>
                <p className="text-xs text-cloud/50">{action.desc}</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-cloud/30 transition group-hover:text-accent" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
