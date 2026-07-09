import { ArrowUpRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function Recommended() {
  const recommendedProducts = [
    {
      prod_name: "Midnight Ankara Bomber",
      product_type_name: "Traditional",
      price: 72.0,
      detail_desc:
        "Because you liked Ankara — a bold bomber with heritage-inspired embroidery and a modern streetwear silhouette.",
    },
    {
      prod_name: "Oversized Agbada Layer Set",
      product_type_name: "Traditional",
      price: 95.5,
      detail_desc:
        "Inspired by your saved fits — a voluminous layering piece that blends ceremonial grandeur with everyday edge.",
    },
    {
      prod_name: "Textured Kaftan Utility",
      product_type_name: "Traditional",
      price: 64.9,
      detail_desc:
        "Based on your recent views — a relaxed kaftan reimagined with cargo pockets and a contemporary drape.",
    },
    {
      prod_name: "Panelled Denim Cargo",
      product_type_name: "Streetwear",
      price: 58.0,
      detail_desc:
        "Matches your style profile — panel-stitched cargo trousers with a relaxed fit and utility pockets.",
    },
  ];
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
        {recommendedProducts.map((product) => (
          <ProductCard key={product.prod_name} product={product} />
        ))}
      </div>
    </section>
  );
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
        {recommendedProducts.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>
    </section>
  );
}
