"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import data from "@/data/articles_sample.json";

export default function Catalog() {
  const [visibleCount, setVisibleCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = searchQuery
    ? data.filter(
        (item) =>
          item.prod_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.product_type_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
    : data;

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section aria-labelledby="catalog-heading" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="catalog-heading"
            className="font-display text-2xl font-medium text-cloud sm:text-3xl"
          >
            Browse the catalog
          </h2>
          <p className="mt-1 text-sm text-cloud/55">Discover your next fit</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(20);
            }}
            placeholder="Search products or categories…"
            className="w-full rounded-xl border border-black/12 bg-panel py-3 pl-11 pr-4 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)] sm:w-72 sm:focus:w-96"
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleProducts.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="glass inline-flex items-center gap-2 rounded-full px-8 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cloud/70 transition hover:bg-[rgba(244,244,242,0.12)] hover:text-cloud"
          >
            See More
          </button>
        </div>
      )}
    </section>
  );
}
