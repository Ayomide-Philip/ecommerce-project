import { ArrowRight } from "lucide-react";

export default function RecentOrders({
  recentOrders,
}: {
  recentOrders: {
    id: string;
    customer: string;
    items: number;
    amount: string;
    payment: string;
    date: string;
  }[];
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
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

      {/* Desktop table — same styling as OrdersDesktop */}
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
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-black/5 last:border-0 dark:border-[rgba(244,244,242,0.05)]"
              >
                <td className="py-3 pl-4 pr-4 sm:pl-6">
                  <p className="font-mono text-xs font-medium text-cloud">
                    {order.id}
                  </p>
                </td>
                <td className="py-3 pr-4">
                  <p className="font-medium text-cloud capitalize">
                    {order.customer}
                  </p>
                </td>
                <td className="py-3 pr-4 text-cloud/70">
                  {order.items} item{order.items !== 1 ? "s" : ""}
                </td>
                <td className="py-3 pr-4 font-medium text-cloud">
                  {order.amount}
                </td>
                <td className="py-3 pr-4 text-cloud/70">{order.payment}</td>
                <td className="py-3 whitespace-nowrap text-cloud/50">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards — same styling as OrdersMobile */}
      <div className="space-y-3 p-5 pt-0 sm:hidden">
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="font-mono text-xs font-medium text-cloud">
                  {order.id}
                </p>
                <p className="mt-0.5 text-sm font-medium text-cloud capitalize">
                  {order.customer}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-black/5 pt-3 text-xs dark:border-[rgba(244,244,242,0.05)]">
              <div>
                <span className="block text-cloud/40">Items</span>
                <span className="text-cloud/70">
                  {order.items} item{order.items !== 1 ? "s" : ""}
                </span>
              </div>
              <div>
                <span className="block text-cloud/40">Total</span>
                <span className="font-medium text-cloud">{order.amount}</span>
              </div>
              <div>
                <span className="block text-cloud/40">Payment</span>
                <span className="text-cloud/70">{order.payment}</span>
              </div>
              <div>
                <span className="block text-cloud/40">Date</span>
                <span className="text-cloud/70">{order.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
