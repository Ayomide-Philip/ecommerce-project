import { ArrowUpRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import data from "@/data/articles_sample.json";

export default function Recommended() {
  const recommended = [...data].sort(() => Math.random() - 0.5).slice(0, 4);
  return (
    <section aria-labelledby="recommended-heading" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2
            id="recommended-heading"
            className="font-display text-3xl font-medium text-cloud"
          >
            Recommended for you
          </h2>
          <p className="mt-1 text-sm text-cloud/55">
            Picked just for your style
          </p>
        </div>
        <a
          href="#"
          className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-cloud/60 transition hover:text-accent"
        >
          See All
          <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {recommended.map((product) => (
          <ProductCard key={product.prod_name} product={product} />
        ))}
      </div>
    </section>
  );
}
