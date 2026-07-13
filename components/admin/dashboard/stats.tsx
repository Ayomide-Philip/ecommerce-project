import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardStats() {
  const [dashboardStats, setDashboardStats] = useState<{
    totalProduct: number;
    totalOrder: number;
    totalRevenue: number;
    totalUsers: number;
  } | null>(null);

  useEffect(() => {
    async function getDashboardStats() {
      try {
        const request = await fetch("/api/admin/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        const response = await request.json();
        if (!request.ok || response?.error) {
          return toast.error(
            response?.error ||
              "Unable to fetch dashboard stats. Please try again later",
          );
        }
        setDashboardStats(response?.stats);
      } catch (err) {
        console.log(err);
        return toast.error(
          "Unable to fetch dashboard stats. Please try again later",
        );
      }
    }
    getDashboardStats();
  }, []);
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {[
        {
          label: "Total Products",
          value: dashboardStats?.totalProduct || "0",
          icon: Package,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          label: "Total Orders",
          value: dashboardStats?.totalOrder || "0",
          icon: ShoppingBag,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
        },
        {
          label: "Revenue",
          value: `$${(dashboardStats?.totalRevenue || 0).toLocaleString()}`,
          icon: DollarSign,
          color: "text-violet-500",
          bg: "bg-violet-500/10",
        },
        {
          label: "Total Users",
          value: dashboardStats?.totalUsers || "0",
          icon: Users,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
        },
      ].map((stat) => {
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
  );
}
