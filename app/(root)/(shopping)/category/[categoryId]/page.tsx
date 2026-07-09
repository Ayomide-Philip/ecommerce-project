"use client";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import data from "@/data/articles_sample.json";
import ProductCard from "@/components/ProductCard";

const slugToCategory = [...new Set(data.map((i) => i?.product_type_name))]
  .filter(Boolean)
  .reduce<Record<string, string>>((acc, name) => {
    const slug = name!.toLowerCase().replace(/\s+/g, "-");
    acc[slug] = name!;
    return acc;
  }, {});

export default function Page() {
  const params = useParams();
  const { categoryId } = params;
  const categoryName = slugToCategory[categoryId as string] || null;
  const products = categoryName
    ? data.filter(
        (item) =>
          item?.product_type_name?.toLowerCase() ===
          categoryName?.toLowerCase(),
      )
    : [];

  if (!categoryName) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-cloud">Category not found</h1>
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

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-3 py-8 sm:px-4 md:px-6 lg:px-8 mt-15 sm:mt-20 lg:mt-22">
      <div className="flex items-center gap-4">
        <Link
          href="/category"
          className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-cloud/60 transition hover:text-cloud"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-medium text-cloud sm:text-4xl">
            {categoryName}
          </h1>
          <p className="mt-1 text-sm text-cloud/55">
            {products.length} {products.length === 1 ? "item" : "items"}{" "}
            available
          </p>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.prod_name + product.price}
            product={product}
          />
        ))}
      </div>
    </main>
  );
}
