"use client";

import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShieldCheck,
  Loader,
} from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CartItem = {
  _id: string;
  productId: {
    _id: string;
    prod_name: string;
    product_type_name: string;
    price: number;
    article_id?: string;
  };
  quantity: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchCartItems() {
      setPageLoading(true);
      try {
        const request = await fetch("/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const response = await request.json();
        if (!request.ok || response?.error) {
          return toast.error(
            response?.error || "Failed to load cart items. Please try again.",
          );
        }
        setItems(response?.cart || []);
      } catch (err) {
        console.log(err);
        return toast.error("Failed to load cart items. Please try again.");
      } finally {
        setPageLoading(false);
      }
    }
    fetchCartItems();
  }, []);

  async function removeItemFromCart(productId: string) {
    setUpdatingIds((prev) => new Set(prev).add(productId));
    try {
      const request = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
        credentials: "include",
      });
      const response = await request.json();
      if (!request.ok || response?.error) {
        return toast.error(
          response?.error ||
            "Failed to remove item from cart. Please try again.",
        );
      }
      setItems((prev) =>
        prev.filter((item) => item?.productId?._id !== productId),
      );
      toast.success(
        response?.message || "Item removed from cart successfully.",
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove item from cart. Please try again.");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }

  async function updateQty(id: string, delta: number) {
    const currentItem = items.find((i) => i?.productId?._id === id);
    const newQty = Math.max(1, (currentItem?.quantity ?? 1) + delta);

    setUpdatingIds((prev) => new Set(prev).add(id));

    // Optimistically update the UI
    setItems((prev) =>
      prev
        .map((item) =>
          item?.productId?._id === id ? { ...item, quantity: newQty } : item,
        )
        .filter((item) => item?.quantity > 0),
    );

    try {
      const request = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id, quantity: newQty }),
        credentials: "include",
      });

      const response = await request.json();
      if (!request.ok || response?.error) {
        // Revert on failure
        setItems((prev) =>
          prev
            .map((item) =>
              item?.productId?._id === id
                ? { ...item, quantity: newQty - delta }
                : item,
            )
            .filter((item) => item?.quantity > 0),
        );
        return toast.error(
          response?.error || "Failed to update quantity. Please try again.",
        );
      }
    } catch {
      // Revert on failure
      setItems((prev) =>
        prev
          .map((item) =>
            item?.productId?._id === id
              ? { ...item, quantity: newQty - delta }
              : item,
          )
          .filter((item) => item?.quantity > 0),
      );
      toast.error("Failed to update quantity. Please try again.");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item?.productId?.price * item?.quantity,
    0,
  );
  const shipping = subtotal >= 100 ? 0 : 15.99;
  const total = subtotal + shipping;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-3 py-8 sm:px-4 md:px-6 lg:px-8 mt-15 sm:mt-16 lg:mt-18">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="glass flex h-10 w-10 items-center justify-center rounded-full">
            <ShoppingCart aria-hidden="true" className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-xl font-medium text-cloud sm:text-3xl">
              Cart
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
              {items?.length} {items?.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
        <Link
          href="/catalog"
          className="glass inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/60 transition hover:text-cloud sm:text-[11px]"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Continue
        </Link>
      </div>

      {pageLoading ? (
        <div className="glass flex flex-col items-center justify-center rounded-[20px] py-20 text-center">
          <Loader
            aria-hidden="true"
            className="h-8 w-8 animate-spin text-cloud/30"
          />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-cloud/40">
            Loading your cart…
          </p>
        </div>
      ) : items?.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-[20px] py-20 text-center">
          <ShoppingCart
            aria-hidden="true"
            className="mb-4 h-12 w-12 text-cloud/20"
          />
          <p className="font-display text-xl text-cloud/50">
            Your cart is empty
          </p>
          <p className="mt-2 text-sm text-cloud/30">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link
            href="/catalog"
            className="mt-6 rounded-full bg-accent/10 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition hover:bg-accent/20"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="glass flex items-center gap-4 rounded-[20px] p-4 transition hover:bg-[rgba(244,244,242,0.1)] sm:gap-6 sm:p-5"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/12 bg-panel sm:h-24 sm:w-24 sm:rounded-2xl dark:border-[rgba(244,244,242,0.12)]">
                  <CldImage
                    src={item?.productId?.article_id || ""}
                    alt={item?.productId?.prod_name || ""}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    width={400}
                    height={400}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.classList.add(
                        "font-mono",
                        "text-[9px]",
                        "uppercase",
                        "tracking-[0.12em]",
                        "text-cloud/50",
                      );
                      e.currentTarget.parentElement!.textContent =
                        item?.productId?.product_type_name || "";
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-sm font-medium text-cloud sm:text-lg">
                    {item?.productId?.prod_name}
                  </h3>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-cloud/50 sm:text-[10px]">
                    {item?.productId?.product_type_name}
                  </p>
                  <p className="mt-1 font-mono text-xs text-accent sm:text-sm">
                    ${item?.productId?.price?.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                  <div className="glass flex items-center gap-1 rounded-full border border-black/8 px-1.5 py-1 sm:px-2 dark:border-[rgba(244,244,242,0.08)]">
                    <button
                      type="button"
                      disabled={updatingIds.has(item?.productId?._id)}
                      onClick={() => updateQty(item?.productId?._id, -1)}
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-cloud/50 transition hover:bg-black/8 hover:text-cloud disabled:opacity-30 sm:h-7 sm:w-7 dark:hover:bg-[rgba(244,244,242,0.08)]"
                      aria-label="Decrease quantity"
                    >
                      <Minus
                        aria-hidden="true"
                        className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                      />
                    </button>
                    <span className="flex h-6 w-6 items-center justify-center font-mono text-xs text-cloud sm:h-7 sm:w-8 sm:text-sm">
                      {updatingIds.has(item?.productId?._id) ? (
                        <Loader
                          aria-hidden="true"
                          className="h-3 w-3 animate-spin text-cloud/50"
                        />
                      ) : (
                        item?.quantity
                      )}
                    </span>
                    <button
                      type="button"
                      disabled={updatingIds.has(item?.productId?._id)}
                      onClick={() => updateQty(item?.productId?._id, 1)}
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-cloud/50 transition hover:bg-black/8 hover:text-cloud disabled:opacity-30 sm:h-7 sm:w-7 dark:hover:bg-[rgba(244,244,242,0.08)]"
                      aria-label="Increase quantity"
                    >
                      <Plus
                        aria-hidden="true"
                        className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                      />
                    </button>
                  </div>

                  <p className="font-mono text-xs font-medium text-cloud sm:hidden">
                    ${(item?.productId?.price * item?.quantity)?.toFixed(2)}
                  </p>
                  <p className="hidden w-20 text-right font-mono text-sm font-medium text-cloud sm:block">
                    ${(item?.productId?.price * item?.quantity)?.toFixed(2)}
                  </p>

                  <button
                    type="button"
                    disabled={updatingIds.has(item?.productId?._id)}
                    onClick={() => removeItemFromCart(item?.productId?._id)}
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-cloud/40 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30 sm:h-9 sm:w-9"
                    aria-label={`Remove ${item?.productId?.prod_name}`}
                  >
                    {updatingIds.has(item?.productId?._id) ? (
                      <Loader
                        aria-hidden="true"
                        className="h-3.5 w-3.5 animate-spin text-red-400"
                      />
                    ) : (
                      <Trash2
                        aria-hidden="true"
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="glass rounded-[20px] p-5 sm:p-6">
              <h2 className="font-display text-lg font-medium text-cloud">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-cloud/50">Subtotal</span>
                  <span className="font-mono text-cloud">
                    ${subtotal?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cloud/50">Shipping</span>
                  <span className="font-mono text-cloud">
                    {shipping === 0 ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      `$${shipping?.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] leading-relaxed text-cloud/40">
                    Free shipping on orders over $200.00
                  </p>
                )}
                <div className="border-t border-black/8 pt-3 dark:border-[rgba(244,244,242,0.08)]">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-cloud">
                      Total
                    </span>
                    <span className="font-mono font-medium text-cloud dark:text-cloud">
                      ${total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/cart/checkout"
                className="mt-6 flex w-full items-center cursor-pointer justify-center gap-2 rounded-full bg-accent py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white transition hover:bg-accent/90"
              >
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                Checkout
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-cloud/40">
                <ShieldCheck aria-hidden="true" className="h-3 w-3" />
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
