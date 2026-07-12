"use client";

import { ArrowUpRight, Sparkles, Loader } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { Product } from "@/libs/models/products.models";
import { toast } from "sonner";

type ProductExtend = Product & {
  _id: string;
};

export default function Recommended() {
  const [userRecommendations, setUserRecommendations] = useState<
    ProductExtend[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRecommendations() {
      setLoading(true);
      try {
        const request = await fetch("/api/recommendations?topN=4", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "force-cache",
        });
        const response = await request.json();
        if (!request.ok || response?.error) {
          return toast.error(
            response?.error ||
              "Failed to load user recommendations. Please try again later.",
          );
        }
        setUserRecommendations(response?.recommendations || []);
      } catch (err) {
        console.log(err);
        return toast.error(
          "Failed to load user recommendations. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchUserRecommendations();
  }, []);

  return (
    <section aria-labelledby="recommended-heading" className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2
              id="recommended-heading"
              className="font-display text-2xl font-medium text-cloud sm:text-3xl"
            >
              Recommended for you
            </h2>
            <p className="mt-1 text-sm text-cloud/55">
              Picked just for your style
            </p>
          </div>
        </div>
        <a
          href="#"
          className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-cloud/60 transition hover:text-accent"
        >
          See All
          <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
        </a>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-cloud/10 py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader className="h-6 w-6 animate-spin text-cloud/30" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/30">
              Loading recommendations…
            </p>
          </div>
        </div>
      ) : userRecommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-cloud/10 py-16 text-center">
          <Sparkles className="h-8 w-8 text-cloud/20" />
          <p className="mt-3 font-display text-lg font-medium text-cloud/40">
            No recommendations yet
          </p>
          <p className="mt-1 text-sm text-cloud/30">
            Browse more products to get personalized picks
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {userRecommendations.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
