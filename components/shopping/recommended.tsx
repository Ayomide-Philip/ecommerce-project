"use client";

import { ArrowUpRight } from "lucide-react";
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

  useEffect(() => {
    async function fetchUserRecommendations() {
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
      }
    }
    fetchUserRecommendations();
  }, []);

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
        {userRecommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
