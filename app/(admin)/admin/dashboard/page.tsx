"use client";


import RecentOrders from "@/components/admin/dashboard/recentorders";
import QuickActions from "@/components/admin/dashboard/quickactions";
import DashboardStats from "@/components/admin/dashboard/stats";
import AdminDashboardHeader from "@/components/admin/dashboard/header";

export default function AdminDashboardPage() {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
  <AdminDashboardHeader/>

      <DashboardStats />
      <RecentOrders />
      <QuickActions />
    </div>
  );
}
