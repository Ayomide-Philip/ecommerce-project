"use client";

import { Package, ShoppingBag, Users, DollarSign, Search } from "lucide-react";
import Toggle from "@/components/toggle";
import RecentOrders from "@/components/admin/dashboard/recentorders";
import QuickActions from "@/components/admin/dashboard/quickactions";
import DashboardStats from "@/components/admin/dashboard/stats";

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
    items: 3,
    amount: "$129.00",
    payment: "Credit Card",
    date: "2 min ago",
  },
  {
    id: "#ORD-7841",
    customer: "Chidi Eze",
    items: 1,
    amount: "$89.00",
    payment: "PayPal",
    date: "15 min ago",
  },
  {
    id: "#ORD-7840",
    customer: "Zara Bello",
    items: 2,
    amount: "$159.00",
    payment: "Credit Card",
    date: "1 hr ago",
  },
  {
    id: "#ORD-7839",
    customer: "Kofi Mensah",
    items: 4,
    amount: "$210.00",
    payment: "Bank Transfer",
    date: "3 hrs ago",
  },
  {
    id: "#ORD-7838",
    customer: "Ngozi Adeyemi",
    items: 2,
    amount: "$74.00",
    payment: "PayPal",
    date: "5 hrs ago",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
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

      <DashboardStats stats={stats} />
      <RecentOrders recentOrders={recentOrders} />
      <QuickActions />
    </div>
  );
}
