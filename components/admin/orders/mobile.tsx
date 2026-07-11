type Order = {
  _id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
};

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
};

export default function OrdersMobile({
  paginatedOrders,
}: {
  paginatedOrders: Order[];
}) {
  return (
    <div className="space-y-3 sm:hidden">
      {paginatedOrders.map((order) => (
        <div
          key={order._id}
          className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60"
        >
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="font-mono text-xs font-medium text-cloud">
                #{order._id.slice(-8)}
              </p>
              <p className="mt-0.5 text-sm font-medium text-cloud">
                {order.customerName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-black/5 pt-3 text-xs dark:border-[rgba(244,244,242,0.05)]">
            <div>
              <span className="block text-cloud/40">Items</span>
              <span className="text-cloud/70">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </span>
            </div>
            <div>
              <span className="block text-cloud/40">Total</span>
              <span className="font-medium text-cloud">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="block text-cloud/40">Payment</span>
              <span className="text-cloud/70">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="block text-cloud/40">Date</span>
              <span className="text-cloud/70">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
        </div>
      ))}
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
