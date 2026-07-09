"use client";

import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type WishlistItem = {
  id: number;
  prod_name: string;
  product_type_name: string;
  price: number;
  inStock: boolean;
};

const initialItems: WishlistItem[] = [
  {
    id: 1,
    prod_name: "Elegant Trousers Line",
    product_type_name: "Trousers",
    price: 231.0,
    inStock: true,
  },
  {
    id: 2,
    prod_name: "Chic Watch Collection",
    product_type_name: "Watch",
    price: 38.99,
    inStock: true,
  },
  {
    id: 3,
    prod_name: "Modern Gloves Style",
    product_type_name: "Gloves",
    price: 223.99,
    inStock: false,
  },
  {
    id: 4,
    prod_name: "Cozy Dress Look",
    product_type_name: "Dress",
    price: 161.0,
    inStock: true,
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(initialItems);

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-3 py-8 sm:px-4 md:px-6 lg:px-8 mt-15 sm:mt-16 lg:mt-18">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="glass flex h-10 w-10 items-center justify-center rounded-full">
            <Heart aria-hidden="true" className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium text-cloud sm:text-3xl">
              Wishlist
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>
        <Link
          href="/catalog"
          className="glass flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-cloud/60 transition hover:text-cloud"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Browse Products
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div className="glass flex flex-col items-center justify-center rounded-[20px] py-20 text-center">
          <Heart aria-hidden="true" className="mb-4 h-12 w-12 text-cloud/20" />
          <p className="font-display text-xl text-cloud/50">
            Your wishlist is empty
          </p>
          <p className="mt-2 text-sm text-cloud/30">
            Save items you love and come back to them later.
          </p>
          <Link
            href="/catalog"
            className="mt-6 rounded-full bg-accent/10 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition hover:bg-accent/20"
          >
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const productSlug = item.prod_name
              ?.toLowerCase()
              ?.replace(/\s+/g, "-")
              ?.replace(/\//g, "-");
            const categorySlug = item.product_type_name
              ?.toLowerCase()
              ?.replace(/\s+/g, "-")
              ?.replace(/\//g, "-");

            return (
              <div
                key={item.id}
                className="glass group relative overflow-hidden rounded-[20px] p-4 transition hover:bg-[rgba(244,244,242,0.1)]"
              >
                {/* Image placeholder */}
                <Link href={`/category/${categorySlug}/product/${productSlug}`}>
                  <div className="relative mb-4 h-44 overflow-hidden rounded-2xl border border-black/12 bg-panel dark:border-[rgba(244,244,242,0.12)]">
                    <div className="flex h-full items-center justify-center">
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-cloud/30">
                        {item.product_type_name}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Wishlist badge — remove button */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-red-400 shadow-sm backdrop-blur-sm transition hover:bg-red-500 hover:text-white dark:bg-[rgba(11,11,13,0.8)]"
                  aria-label={`Remove ${item.prod_name} from wishlist`}
                >
                  <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                </button>

                {/* Product info */}
                <Link href={`/category/${categorySlug}/product/${productSlug}`}>
                  <h3 className="truncate font-display text-base font-medium text-cloud">
                    {item.prod_name}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cloud/40">
                    {item.product_type_name}
                  </p>
                  <p className="mt-2 font-mono text-sm text-accent">
                    ${item.price.toFixed(2)}
                  </p>
                </Link>

                {/* Stock status + Add to cart */}
                <div className="mt-4 flex items-center gap-2">
                  {item.inStock ? (
                    <>
                      <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        In Stock
                      </span>
                      <button
                        type="button"
                        className="ml-auto flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent transition hover:bg-accent/20"
                      >
                        <ShoppingCart aria-hidden="true" className="h-3 w-3" />
                        Add to Cart
                      </button>
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-cloud/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-cloud/30" />
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
