import { ArrowUpRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import data from "@/data/articles_sample.json";

export default async function LandingCatalog() {
  const visibleProducts = data.slice(0, 20);

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
    </section>
  );
}
