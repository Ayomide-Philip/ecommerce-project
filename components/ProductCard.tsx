"use client";
import { imageMap } from "./static/imagemap";
import Link from "next/link";
import { LoaderCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* eslint-disable @next/next/no-img-element */
type Product = {
  prod_name: string;
  product_type_name: string;
  price: number;
  detail_desc?: string;
  _id: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  async function handleAddToCart(productId: string, qty: number) {
    if (adding) return;
    setAdding(true);
    try {
      const request = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: qty }),
        credentials: "include",
      });

      const response = await request.json();
      if (!request.ok || response?.error) {
        return toast.error(
          response?.error || "Failed to add item to cart. Please try again.",
        );
      }
      toast.success(response?.message || "Item added to cart successfully.");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  const imgSrc = `/images/${imageMap[product?.product_type_name] || product?.product_type_name?.toLowerCase()?.replace(/\s+/g, "-")}.jpg`;
  const categorySlug = product?.product_type_name
    ?.toLowerCase()
    ?.replace(/\s+/g, "-")
    ?.replace(/\//g, "-");

  return (
    <article className="group glass relative overflow-hidden rounded-[20px] p-4 transition duration-300 hover:bg-[rgba(244,244,242,0.1)]">
      <Link href={`/category/${categorySlug}/product/${product?._id}`}>
        <div className="relative mb-4 h-52 overflow-hidden rounded-2xl border border-black/12 bg-panel dark:border-[rgba(244,244,242,0.12)]">
          <img
            src={imgSrc}
            alt={product.prod_name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        </div>

        <h3 className="font-display text-lg font-medium text-cloud">
          {product?.prod_name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-cloud/50 line-clamp-2">
          {product?.detail_desc}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-mono text-sm text-accent">
            ${product?.price.toFixed(2)}
          </p>
          <span className="glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cloud/80">
            {product?.product_type_name}
          </span>
        </div>
      </Link>

      <div className="mt-3 flex items-center gap-2">
        <div className="glass flex items-center gap-1 rounded-full px-1 py-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-[rgba(244,244,242,0.12)]"
            aria-label="Decrease quantity"
          >
            <Minus aria-hidden="true" className="h-3 w-3 text-cloud/70" />
          </button>
          <span className="flex h-7 min-w-6 items-center justify-center font-mono text-xs text-cloud">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-[rgba(244,244,242,0.12)]"
            aria-label="Increase quantity"
          >
            <Plus aria-hidden="true" className="h-3 w-3 text-cloud/70" />
          </button>
        </div>

        <button
          type="button"
          disabled={adding}
          onClick={() => handleAddToCart(product._id, quantity)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent/10 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {adding ? (
            <LoaderCircle
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin"
            />
          ) : (
            <ShoppingCart aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {adding ? "Adding…" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
