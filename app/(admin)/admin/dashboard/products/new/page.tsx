import ProductForm from "@/components/admin/product/new/form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/dashboard/products"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 text-cloud/50 transition hover:bg-black/5 hover:text-cloud dark:border-[rgba(244,244,242,0.08)] dark:hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-medium text-cloud sm:text-2xl">
            New Product
          </h1>
          <p className="text-xs text-cloud/50 sm:text-sm">
            Add a new product to your catalog
          </p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
