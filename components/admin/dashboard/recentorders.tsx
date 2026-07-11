import { ArrowRight } from "lucide-react";

export const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Processing: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Shipped: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Pending: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
};

export default function RecentOrders({
  recentOrders,
}: {
  recentOrders: {
    id: string;
    customer: string;
    product: string;
    amount: string;
    date: string;
  }[];
}) {
  return (
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

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-xs uppercase tracking-wider text-cloud/40 dark:border-[rgba(244,244,242,0.08)]">
              <th className="pb-3 pr-4 font-medium">Order</th>
              <th className="pb-3 pr-4 font-medium">Customer</th>
              <th className="pb-3 pr-4 font-medium">Product</th>
              <th className="pb-3 pr-4 font-medium">Amount</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-black/5 last:border-0 dark:border-[rgba(244,244,242,0.05)]"
              >
                <td className="py-3 pr-4 font-medium text-cloud">{order.id}</td>
                <td className="py-3 pr-4 text-cloud/70">{order.customer}</td>
                <td className="py-3 pr-4 text-cloud/70">{order.product}</td>
                <td className="py-3 pr-4 font-medium text-cloud">
                  {order.amount}
                </td>
                <td className="py-3 text-cloud/50">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-black/10 bg-white/60 p-3.5 dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/40"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-cloud">{order.id}</span>
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
  );
}
