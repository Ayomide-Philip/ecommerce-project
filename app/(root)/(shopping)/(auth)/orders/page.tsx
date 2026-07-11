"use client";

import { ShoppingBag, ArrowLeft, Loader, Package, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type OrderItem = {
  productId: {
    _id: string;
    prod_name: string;
    product_type_name: string;
    price: number;
  };
  quantity: number;
  priceAtPurchase: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const request = await fetch("/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const response = await request.json();
        if (!request.ok || response?.error) {
          return toast.error(
            response?.error || "Failed to load orders. Please try again.",
          );
        }
        setOrders(response?.orders || []);
      } catch (err) {
        console.log(err);
        return toast.error("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-3 py-8 sm:px-4 md:px-6 lg:px-8 mt-15 sm:mt-16 lg:mt-18">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="glass flex h-10 w-10 items-center justify-center rounded-full">
            <Package aria-hidden="true" className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium text-cloud sm:text-3xl">
              My Orders
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
              {orders.length} {orders.length === 1 ? "order" : "orders"} placed
            </p>
          </div>
        </div>
        <Link
          href="/catalog"
          className="glass flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-cloud/60 transition hover:text-cloud"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Continue Shopping
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="glass flex flex-col items-center justify-center rounded-[20px] py-20 text-center">
          <Loader
            aria-hidden="true"
            className="h-8 w-8 animate-spin text-cloud/30"
          />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-cloud/40">
            Loading your orders…
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && orders.length === 0 && (
        <div className="glass flex flex-col items-center justify-center rounded-[20px] py-20 text-center">
          <ShoppingBag
            aria-hidden="true"
            className="mb-4 h-12 w-12 text-cloud/20"
          />
          <p className="font-display text-xl text-cloud/50">No orders yet</p>
          <p className="mt-2 text-sm text-cloud/30">
            Looks like you haven&apos;t placed any orders.
          </p>
          <Link
            href="/catalog"
            className="mt-6 rounded-full bg-accent/10 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition hover:bg-accent/20"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Orders list */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass rounded-[20px] p-5 transition hover:bg-[rgba(244,244,242,0.1)] sm:p-6"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                    <Package
                      aria-hidden="true"
                      className="h-4 w-4 text-accent"
                    />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock
                        aria-hidden="true"
                        className="h-3 w-3 text-cloud/30"
                      />
                      <p className="font-mono text-[10px] text-cloud/30">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  {order.status}
                </span>
              </div>

              {/* Order items */}
              <div className="mt-4 divide-y divide-black/8 dark:divide-[rgba(244,244,242,0.08)]">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-medium text-cloud">
                        {item?.productId?.prod_name}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cloud/40">
                        {item?.productId?.product_type_name} × {item.quantity}
                      </p>
                    </div>
                    <p className="ml-4 shrink-0 font-mono text-sm text-cloud">
                      ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-black/8 pt-3 dark:border-[rgba(244,244,242,0.08)]">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                  Total
                </span>
                <span className="font-mono font-medium text-cloud dark:text-cloud">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
