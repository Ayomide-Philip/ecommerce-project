"use client";

import LeftOrderSummary from "@/components/shopping/checkout/leftOrderSummary";
import RightOrderSummary from "@/components/shopping/checkout/rightOrderSummary";
import { CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type FieldKey =
  | "fullName"
  | "address"
  | "city"
  | "zip"
  | "cardNumber"
  | "expiry"
  | "cvv";

type Errors = Partial<Record<FieldKey, string>>;

export default function CheckoutPage() {
  const [fields, setFields] = useState<Record<FieldKey, string>>({
    fullName: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [productItems, setProductItems] = useState<
    { name: string; type: string; price: number; quantity: number }[]
  >([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);

  useEffect(() => {
    async function fetchCart() {
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
          return toast.error("Failed to fetch cart items. Please try again.");
        }

        const r = response?.cart.map(
          (c: {
            productId: {
              prod_name: string;
              product_type_name: string;
              price: number;
            };
            quantity: number;
          }) => {
            return {
              name: c?.productId?.prod_name,
              type: c?.productId?.product_type_name,
              price: c?.productId?.price,
              quantity: c?.quantity,
            };
          },
        );

        setProductItems(r || []);

        const s = r.reduce(
          (sum: number, item: { price: number; quantity: number }): number =>
            sum + item.price * item.quantity,
          0,
        );
        setSubtotal(s);
        setShipping(subtotal >= 100 ? 0 : 15.99);
        setTotal(s + (subtotal >= 100 ? 0 : 15.99));
      } catch (err) {
        console.log(err);
        return toast.error("Failed to fetch cart items. Please try again.");
      }
    }

    fetchCart();
  }, []);

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

        <RightOrderSummary
          sampleItems={productItems}
          subtotal={subtotal}
          shipping={shipping || 0}
          total={total || 0}
          handlePlaceOrder={handlePlaceOrder}
        />
      </div>
    </main>
  );
}
