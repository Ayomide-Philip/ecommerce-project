"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import data from "@/data/articles_sample.json";

const INITIAL_COUNT = 20;
const LOAD_MORE = 20;

export default function LandingCatalog() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleProducts = data.slice(0, visibleCount);
  const hasMore = visibleCount < data.length;

  return (
    <section aria-labelledby="landing-catalog-heading" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2
            id="landing-catalog-heading"
            className="font-display text-3xl font-medium text-cloud"
          >
            Browse the catalog
          </h2>
          <p className="mt-1 text-sm text-cloud/55">Discover your next fit</p>
        </div>
        <a
          href="/catalog"
          className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-cloud/60 transition hover:text-accent"
        >
          View All
          <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
        </a>
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
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE)}
            className="glass inline-flex items-center gap-2 rounded-full px-8 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cloud/70 transition hover:bg-[rgba(244,244,242,0.12)] hover:text-cloud"
          >
            See More ({data.length - visibleCount} left)
          </button>
        </div>
      )}
    </section>
  );
}
