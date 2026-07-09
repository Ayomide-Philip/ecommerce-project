"use client";

import { useState } from "react";
import FilterPills from "@/components/FilterPills";
import ProductCard from "@/components/ProductCard";
import data from "@/data/articles_sample.json";

export default function Catalog() {
  const [visibleCount, setVisibleCount] = useState(20);

  const catalogFilters = [
    "All",
    "Streetwear",
    "Traditional",
    "Bridal",
    "Sneakers",
    "Sportswear",
  ];

  const visibleProducts = data.slice(0, visibleCount);
  const hasMore = visibleCount < data.length;

  return (
    <section aria-labelledby="catalog-heading" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2
            id="catalog-heading"
            className="font-display text-3xl font-medium text-cloud"
          >
            Browse the catalog
          </h2>
          <p className="mt-1 text-sm text-cloud/55">Discover your next fit</p>
        </div>
      </div>

      <FilterPills filters={catalogFilters} activeFilter="All" />

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
