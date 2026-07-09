"use client";

import { useEffect, useState } from "react";
import { Shuffle, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/loading";
import { toast } from "sonner";

type ProductExtend = {
  _id: string;
  prod_name: string;
  product_type_name: string;
  price: number;
  detail_desc?: string;
};

export default function RecommendationPage() {
  const [allProducts, setAllProducts] = useState<ProductExtend[]>([]);
  const [recommended, setRecommended] = useState<ProductExtend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products?limit=50", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "default",
        });
        const data = await res.json();
        if (!res.ok || data?.error) {
          return toast.error(data?.error || "Failed to load recommendations.");
        }
        setAllProducts(data?.product || []);
      } catch {
        toast.error("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Shuffle and pick 8 random products whenever the source list changes
  useEffect(() => {
    if (allProducts.length > 0) {
      shuffleProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts]);

  function shuffleProducts() {
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    setRecommended(shuffled.slice(0, 8));
  }

  if (loading) return <Loading />;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-20 px-3 py-8 sm:px-4 md:px-6 lg:px-8 mt-15 sm:mt-16 lg:mt-18">
      <section aria-labelledby="recommendation-heading" className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Sparkles
                aria-hidden="true"
                className="h-6 w-6 text-accent sm:h-7 sm:w-7"
              />
              <h2
                id="recommendation-heading"
                className="font-display text-2xl font-medium text-cloud sm:text-3xl"
              >
                Recommended for you
              </h2>
            </div>
            <p className="mt-2 text-sm text-cloud/55">
              A curated selection we think you&rsquo;ll love —{" "}
              {recommended.length} picks ready for you.
            </p>
          </div>

          <button
            type="button"
            onClick={shuffleProducts}
            className="glass inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-cloud/70 transition hover:bg-[rgba(244,244,242,0.12)]"
          >
            <Shuffle aria-hidden="true" className="h-3.5 w-3.5" />
            Refresh picks
          </button>
        </div>

        {/* Product grid */}
        {recommended.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommended.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-cloud/10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cloud/30">
              No recommendations available right now
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
