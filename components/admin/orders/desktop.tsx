type Order = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
};

type OrderItem = {
  _id: string;
  quantity: number;
  priceAtPurchase: number;
  productId: {
    prod_name: string;
    _id: string;
  };
};


export default function OrdersDesktop({
  paginatedOrders,
}: {
  paginatedOrders: Order[];
}) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-black/10 bg-white/80 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60 sm:block">
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
          {paginatedOrders.map((order) => (
            <tr
              key={order._id}
              className="border-b border-black/5 last:border-0 dark:border-[rgba(244,244,242,0.05)]"
            >
              <td className="py-3 pl-4 pr-4 sm:pl-6">
                <p className="font-mono text-xs font-medium text-cloud">
                  #{order._id.slice(-8)}
                </p>
              </td>
              <td className="py-3 pr-4">
                <p className="font-medium text-cloud capitalize">
                  {order.userId.name}
                </p>
                <p className="text-xs text-cloud/50">{order.userId.email}</p>
              </td>
              <td className="py-3 pr-4 text-cloud/70">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </td>
              <td className="py-3 pr-4 font-medium text-cloud">
                ${order.totalAmount.toFixed(2)}
              </td>
              <td className="py-3 pr-4 text-cloud/70">{order.paymentMethod}</td>

              <td className="py-3 whitespace-nowrap text-cloud/50">
                {formatDate(order.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
