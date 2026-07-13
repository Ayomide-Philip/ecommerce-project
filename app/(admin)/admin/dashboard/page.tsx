import RecentOrders from "@/components/admin/dashboard/recentorders";
import QuickActions from "@/components/admin/dashboard/quickactions";
import DashboardStats from "@/components/admin/dashboard/stats";
import AdminDashboardHeader from "@/components/admin/dashboard/header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "admin")
    redirect("/admin/login");
  return (
    <div className="w-full max-w-full px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
      <AdminDashboardHeader session={session} />

      <DashboardStats />
      <RecentOrders />
      <QuickActions />
    </div>
  );
}
