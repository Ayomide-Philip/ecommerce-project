"use client";

import LeftOrderSummary from "@/components/shopping/checkout/leftOrderSummary";
import { CreditCard, ShieldCheck, ArrowLeft, Lock } from "lucide-react";
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

type FieldKey =
  | "fullName"
  | "address"
  | "city"
  | "zip"
  | "cardNumber"
  | "expiry"
  | "cvv";
type Errors = Partial<Record<FieldKey, string>>;

const initialFields: Record<FieldKey, string> = {
  fullName: "John Doe",
  address: "123 Fashion Street",
  city: "New York",
  zip: "10001",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

export default function CheckoutPage() {
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<Errors>({});

  function updateField(key: FieldKey, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Errors = {};

    if (!fields.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!fields.address.trim()) newErrors.address = "Address is required.";
    if (!fields.city.trim()) newErrors.city = "City is required.";
    if (!fields.zip.trim()) newErrors.zip = "ZIP code is required.";
    else if (!/^\d{5}(-\d{4})?$/.test(fields.zip.trim()))
      newErrors.zip = "Enter a valid ZIP code (e.g. 10001).";

    const cleanedCard = fields.cardNumber.replace(/\s/g, "");
    if (!cleanedCard) newErrors.cardNumber = "Card number is required.";
    else if (!/^\d{16}$/.test(cleanedCard))
      newErrors.cardNumber = "Enter a valid 16-digit card number.";

    if (!fields.expiry.trim()) newErrors.expiry = "Expiry date is required.";
    else if (!/^\d{2}\/\d{2}$/.test(fields.expiry.trim()))
      newErrors.expiry = "Use MM/YY format.";

    if (!fields.cvv.trim()) newErrors.cvv = "CVV is required.";
    else if (!/^\d{3}$/.test(fields.cvv.trim()))
      newErrors.cvv = "CVV must be 3 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handlePlaceOrder() {
    if (validate()) {
      alert("Order placed successfully! (Demo)");
    }
  }

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
        <LeftOrderSummary
          fields={fields}
          errors={errors}
          updateField={updateField}
        />

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
                <span className="font-mono font-medium text-cloud dark:text-cloud">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
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
