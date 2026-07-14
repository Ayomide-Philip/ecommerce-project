"use client";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Order } from "../../../app/(admin)/admin/dashboard/orders/page";
import { toast } from "sonner";
import { formatDate } from "../orders/desktop";
import Link from "next/link";

export default function RecentOrders() {
  const [recentOrdersData, setRecentOrdersData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRecentOrders() {
      try {
        const request = await fetch("/api/admin/orders?limit=5", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const response = await request.json();

        if (!request?.ok || response?.error) {
          toast.error(response?.error || "Failed to get recent Orders");
          return;
        }

        setRecentOrdersData(response?.orders);
      } catch (err) {
        console.log(err);
        toast.error("Unable to get recent orders");
      } finally {
        setLoading(false);
      }
    }
    getRecentOrders();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h2 className="font-display text-lg font-medium text-cloud">
            Recent Orders
          </h2>
        </div>

        <div className="hidden overflow-hidden sm:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-black/5 text-xs uppercase tracking-wider text-cloud/40 dark:border-[rgba(244,244,242,0.08)] dark:bg-white/5">
                <th className="py-3 pl-4 pr-4 font-medium sm:pl-6">Order</th>
                <th className="py-3 pr-4 font-medium">Customer</th>
                <th className="py-3 pr-4 font-medium">Items</th>
                <th className="py-3 pr-4 font-medium">Total</th>
                <th className="py-3 pr-4 font-medium">Payment</th>
                <th className="py-3 pr-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr
                  key={i}
                  className="animate-pulse border-b border-black/5 last:border-0 dark:border-[rgba(244,244,242,0.05)]"
                >
                  <td className="py-3 pl-4 pr-4 sm:pl-6">
                    <div className="h-4 w-20 rounded bg-black/5 dark:bg-white/5" />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="h-4 w-32 rounded bg-black/5 dark:bg-white/5" />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="h-4 w-12 rounded bg-black/5 dark:bg-white/5" />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="h-4 w-16 rounded bg-black/5 dark:bg-white/5" />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="h-4 w-20 rounded bg-black/5 dark:bg-white/5" />
                  </td>
                  <td className="py-3">
                    <div className="h-4 w-24 rounded bg-black/5 dark:bg-white/5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-5 pt-0 sm:hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60"
            >
              <div className="mb-3 space-y-2">
                <div className="h-3 w-24 rounded bg-black/5 dark:bg-white/5" />
                <div className="h-4 w-36 rounded bg-black/5 dark:bg-white/5" />
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-black/5 pt-3 dark:border-[rgba(244,244,242,0.05)]">
                <div className="h-3 w-16 rounded bg-black/5 dark:bg-white/5" />
                <div className="h-3 w-16 rounded bg-black/5 dark:bg-white/5" />
                <div className="h-3 w-16 rounded bg-black/5 dark:bg-white/5" />
                <div className="h-3 w-16 rounded bg-black/5 dark:bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h2 className="font-display text-lg font-medium text-cloud">
          Recent Orders
        </h2>
        <Link
          href="/admin/dashboard/orders"
          className="flex items-center gap-1 text-xs font-medium text-accent transition hover:text-accent/80"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {recentOrdersData.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 pb-8 pt-4">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-black/5 dark:border-[rgba(244,244,242,0.08)] dark:bg-white/5">
            <svg
              className="h-6 w-6 text-cloud/40"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-cloud">No orders yet</p>
          <p className="mt-0.5 text-xs text-cloud/50">
            Orders will appear here once customers start shopping.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-black/5 text-xs uppercase tracking-wider text-cloud/40 dark:border-[rgba(244,244,242,0.08)] dark:bg-white/5">
                  <th className="py-3 pl-4 pr-4 font-medium sm:pl-6">Order</th>
                  <th className="py-3 pr-4 font-medium">Customer</th>
                  <th className="py-3 pr-4 font-medium">Items</th>
                  <th className="py-3 pr-4 font-medium">Total</th>
                  <th className="py-3 pr-4 font-medium">Payment</th>
                  <th className="py-3 pr-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrdersData.map((order) => (
                  <tr
                    key={order?._id}
                    className="border-b border-black/5 last:border-0 dark:border-[rgba(244,244,242,0.05)]"
                  >
                    <td className="py-3 pl-4 pr-4 sm:pl-6">
                      <p className="font-mono text-xs font-medium text-cloud">
                        {order?._id}
                      </p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-cloud capitalize">
                        {order?.userId?.name}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-cloud/70">
                      {order?.items?.length} item
                      {order?.items?.length !== 1 ? "s" : ""}
                    </td>
                    <td className="py-3 pr-4 font-medium text-cloud">
                      {order?.totalAmount?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td className="py-3 pr-4 text-cloud/70">
                      {order?.paymentMethod}
                    </td>
                    <td className="py-3 whitespace-nowrap text-cloud/50">
                      {formatDate(order?.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-5 pt-0 sm:hidden">
            {recentOrdersData.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs font-medium text-cloud">
                      {order?._id}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-cloud capitalize">
                      {order?.userId?.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-black/5 pt-3 text-xs dark:border-[rgba(244,244,242,0.05)]">
                  <div>
                    <span className="block text-cloud/40">Items</span>
                    <span className="text-cloud/70">
                      {order?.items?.length} item
                      {order?.items?.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div>
                    <span className="block text-cloud/40">Total</span>
                    <span className="font-medium text-cloud">
                      {order?.totalAmount?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="block text-cloud/40">Payment</span>
                    <span className="text-cloud/70">
                      {order?.paymentMethod}
                    </span>
                  </div>
                  <div>
                    <span className="block text-cloud/40">Date</span>
                    <span className="text-cloud/70">
                      {formatDate(order?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
