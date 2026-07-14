"use client";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductTypeName } from "@/libs/enums/product.enums";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Product } from "@/libs/models/products.models";
import Loading from "@/components/loading";

const slugToCategory = ProductTypeName.reduce<Record<string, string>>(
  (acc, name) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    acc[slug] = name;
    return acc;
  },
  {},
);

export default function Page() {
  const params = useParams();
  const { categoryId } = params;
  const [category, setCategory] = useState<ProductExtend[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!categoryId) return;
    async function fetchCategory() {
      setLoading(true);
      try {
        const request = await fetch(`/api/categories/${categoryId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const response = await request.json();
        if (!request?.ok || response?.error) {
          setCategory(null);
          setLoading(false);
          return toast.error(response?.error || "Failed to fetch category");
        }

        setCategory(response?.category || null);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        return toast.error("Unstable connection. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [categoryId]);

  const categoryName = slugToCategory[categoryId as string] || null;

  if (loading) return <Loading />;

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
            {category?.length} {category?.length === 1 ? "item" : "items"}{" "}
            available
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {category?.map((product: ProductExtend, idx: number) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>
    </main>
  );
}

export type ProductExtend = Product & {
  _id: string;
};
