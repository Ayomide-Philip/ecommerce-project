"use client";

import { CreditCard, ShieldCheck, Truck, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sampleItems = [
  {
    name: "Basic Dress Fit",
    type: "Dress",
    price: 248.99,
    quantity: 1,
  },
  {
    name: "Michael Runner",
    type: "Sneakers",
    price: 79.0,
    quantity: 2,
  },
];

const subtotal = sampleItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0,
);
const shipping = subtotal >= 100 ? 0 : 15.99;
const total = subtotal + shipping;

export default function CheckoutPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-3 py-8 sm:px-4 md:px-6 lg:px-8 mt-15 sm:mt-16 lg:mt-18">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="glass flex h-10 w-10 items-center justify-center rounded-full">
            <CreditCard aria-hidden="true" className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium text-cloud sm:text-3xl">
              Checkout
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
              Complete your order
            </p>
          </div>
        </div>
        <Link
          href="/cart"
          className="glass flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-cloud/60 transition hover:text-cloud"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Back to Cart
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left — Shipping & Payment */}
        <div className="space-y-6 lg:col-span-3">
          {/* Shipping info */}
          <div className="glass rounded-[20px] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Truck aria-hidden="true" className="h-4 w-4 text-accent" />
              <h2 className="font-display text-lg font-medium text-cloud">
                Shipping Address
              </h2>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="John"
                  className="w-full rounded-xl border border-black/12 bg-panel px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Doe"
                  className="w-full rounded-xl border border-black/12 bg-panel px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                  Address
                </label>
                <input
                  type="text"
                  defaultValue="123 Fashion Street"
                  className="w-full rounded-xl border border-black/12 bg-panel px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                  City
                </label>
                <input
                  type="text"
                  defaultValue="New York"
                  className="w-full rounded-xl border border-black/12 bg-panel px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                  ZIP Code
                </label>
                <input
                  type="text"
                  defaultValue="10001"
                  className="w-full rounded-xl border border-black/12 bg-panel px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="glass rounded-[20px] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <CreditCard aria-hidden="true" className="h-4 w-4 text-accent" />
              <h2 className="font-display text-lg font-medium text-cloud">
                Payment Details
              </h2>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  className="w-full rounded-xl border border-black/12 bg-panel px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                    className="w-full rounded-xl border border-black/12 bg-panel px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/40">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={3}
                    className="w-full rounded-xl border border-black/12 bg-panel px-4 py-3 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-2">
          <div className="glass rounded-[20px] p-5 sm:p-6">
            <h2 className="font-display text-lg font-medium text-cloud">
              Order Summary
            </h2>

            {/* Items */}
            <div className="mt-5 divide-y divide-black/8 dark:divide-[rgba(244,244,242,0.08)]">
              {sampleItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-medium text-cloud">
                      {item.name}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cloud/40">
                      {item.type} × {item.quantity}
                    </p>
                  </div>
                  <p className="ml-4 shrink-0 font-mono text-sm text-cloud">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-5 space-y-3 border-t border-black/8 pt-4 dark:border-[rgba(244,244,242,0.08)]">
              <div className="flex justify-between text-sm">
                <span className="text-cloud/50">Subtotal</span>
                <span className="font-mono text-cloud">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cloud/50">Shipping</span>
                <span className="font-mono text-cloud">
                  {shipping === 0 ? (
                    <span className="text-green-400">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-black/8 pt-3 dark:border-[rgba(244,244,242,0.08)]">
                <span className="text-sm font-medium text-cloud">Total</span>
                <span className="font-mono font-medium text-base text-cloud sm:text-base">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order */}
            <button
              type="button"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white transition hover:bg-accent/90"
            >
              <Lock aria-hidden="true" className="h-4 w-4" />
              Place Order — ${total.toFixed(2)}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-cloud/30">
              <ShieldCheck aria-hidden="true" className="h-3 w-3" />
              <span>Simulated payment — no real charges</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
