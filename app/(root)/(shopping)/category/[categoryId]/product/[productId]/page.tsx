/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import data from "@/data/articles_sample.json";
import { imageMap } from "@/components/static/imagemap";

const slugify = (s: string) =>
  s.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");

const slugToCategory = [...new Set(data.map((i) => i?.product_type_name))]
  .filter(Boolean)
  .reduce<Record<string, string>>((acc, name) => {
    acc[slugify(name!)] = name!;
    return acc;
  }, {});

export default function ProductPage() {
  const params = useParams();
  const { categoryId, productId } = params;

  const categoryName = slugToCategory[categoryId as string] || null;
  const product = categoryName
    ? data.find(
        (item) =>
          item.product_type_name === categoryName &&
          slugify(item.prod_name) === productId,
      )
    : null;

  if (!product) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-cloud">Product not found</h1>
        <Link
          href="/"
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
    <main className="mx-auto w-full max-w-7xl space-y-20 px-3 py-8 sm:px-4 md:px-6 lg:px-8">
      <Link
        href={`/category/${categoryId}`}
        className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-cloud/60 transition hover:text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to {categoryName}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-4">
          <div className="relative aspect-3/4 overflow-hidden rounded-3xl border border-black/12 bg-panel dark:border-[rgba(244,244,242,0.12)] sm:aspect-5/4 lg:aspect-4/3">
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
                {product.product_type_name}
              </span>
              <h1 className="font-display text-3xl font-medium text-cloud sm:text-4xl lg:text-5xl">
                {product.prod_name}
              </h1>
            </div>

            <div>
              <p className="font-display text-4xl font-medium text-accent sm:text-5xl">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div className="border-t border-[rgba(244,244,242,0.08)] pt-6">
              <p className="text-sm leading-relaxed text-cloud/60">
                {product.detail_desc}
              </p>
            </div>

            {/* Attributes */}
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
                Details
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Colour", value: product.colour_group_name },
                  {
                    label: "Pattern",
                    value: product.graphical_appearance_name,
                  },
                ].map(
                  (attr) =>
                    attr.value && (
                      <span
                        key={attr.label}
                        className="glass rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cloud/70"
                      >
                        {attr.label}: {attr.value}
                      </span>
                    ),
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-accent px-10 py-4 font-mono text-xs uppercase tracking-[0.16em] text-cloud transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent sm:w-auto"
            >
              <ShoppingCart aria-hidden="true" className="h-4 w-4" />
              Add to Cart — ${product.price.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
