/* eslint-disable @next/next/no-img-element */
"use client";

import { redirect, useParams } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { imageMap } from "@/components/static/imagemap";
import { useEffect, useState } from "react";
import { Product } from "@/libs/models/products.models";
import { toast } from "sonner";
import Loading from "@/components/loading";

export default function ProductPage() {
  const params = useParams();
  const { categoryId, productId } = params;
  const [product, setProducts] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart(productId: string, qty: number) {
    // TODO: Connect to backend cart API
    console.log("Add to cart:", { productId, qty });
  }

  useEffect(() => {
    if (!categoryId || !productId) return redirect("/catalog");
    async function fetchProduct() {
      setLoading(true);
      try {
        const request = await fetch(`/api/products/${productId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        if (!request.ok || response?.error) {
          return toast.error("Failed to fetch product.");
        }
        setProducts(response?.product);
      } catch (err) {
        console.log(err);
        return toast.error("Unstable connection. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [categoryId, productId]);

  if (loading) return <Loading />;

  if (!product) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-cloud">Product not found</h1>
        <Link
          href="/catalog"
          className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cloud/70 transition hover:text-cloud"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back Home
        </Link>
      </div>
    );
  }

  const imgSrc = `/images/${imageMap[product.product_type_name] || product.product_type_name.toLowerCase().replace(/\s+/g, "-")}.jpg`;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-20 px-3 py-8 sm:px-4 md:px-6 lg:px-8 mt-15 sm:mt-16 lg:mt-18">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex items-center justify-center">
          <div className="relative aspect-3/4 w-full max-w-md overflow-hidden rounded-3xl border border-black/12 bg-panel dark:border-[rgba(244,244,242,0.12)] sm:aspect-5/4 lg:aspect-4/3">
            <img
              src={imgSrc}
              alt={product.prod_name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center lg:py-12">
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="inline-block rounded-full border border-accent/20 bg-accent/5 px-4 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                {product?.product_type_name}
              </span>
              <h1 className="font-display text-3xl font-medium text-cloud sm:text-4xl lg:text-5xl">
                {product?.prod_name}
              </h1>
            </div>

            <div>
              <p className="font-display text-4xl font-medium text-accent sm:text-5xl">
                ${product?.price?.toFixed(2)}
              </p>
            </div>

            <div className="border-t border-[rgba(244,244,242,0.08)] pt-6">
              <p className="text-sm leading-relaxed text-cloud/60">
                {product?.detail_desc}
              </p>
            </div>

            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
                Details
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Type", value: product?.product_type_name },
                  { label: "Department", value: product?.department_name },
                  { label: "Index", value: product?.index_name },
                  { label: "Colour", value: product?.colour_group_name },
                  {
                    label: "Colour Value",
                    value: product?.perceived_colour_value_name,
                  },
                  {
                    label: "Colour Family",
                    value: product?.perceived_colour_master_name,
                  },
                  {
                    label: "Pattern",
                    value: product?.graphical_appearance_name,
                  },
                ].map(
                  (attr) =>
                    attr?.value && (
                      <span
                        key={attr?.label}
                        className="glass rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cloud/70"
                      >
                        {attr?.label}: {attr?.value}
                      </span>
                    ),
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quantity stepper */}
              <div className="glass flex items-center gap-1 rounded-full px-2 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[rgba(244,244,242,0.12)]"
                  aria-label="Decrease quantity"
                >
                  <Minus aria-hidden="true" className="h-4 w-4 text-cloud/70" />
                </button>
                <span className="flex h-9 min-w-8 items-center justify-center font-mono text-sm text-cloud">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[rgba(244,244,242,0.12)]"
                  aria-label="Increase quantity"
                >
                  <Plus aria-hidden="true" className="h-4 w-4 text-cloud/70" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleAddToCart(product?._id, quantity)}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-accent px-10 py-4 font-mono text-xs uppercase tracking-[0.16em] text-cloud transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent sm:w-auto"
              >
                <ShoppingCart aria-hidden="true" className="h-4 w-4" />
                Add to Cart — ${(product?.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
