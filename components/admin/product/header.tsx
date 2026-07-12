import { Plus, Search } from "lucide-react";
import Link from "next/link";
export default function ProductHeader({
  searchQuery,
  handleSearch,
  productLength,
}: {
  searchQuery: string;
  handleSearch: (value: string) => void;
  productLength: number;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-xl font-medium text-cloud sm:text-3xl">
          Products
        </h1>
        <p className="mt-0.5 text-xs text-cloud/50 sm:mt-1 sm:text-sm">
          Manage your product catalog — {productLength} total items
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cloud/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-black/10 bg-white/80 py-2 pl-9 pr-3 text-sm text-cloud placeholder:text-cloud/40 focus:outline-none focus:ring-2 focus:ring-accent dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50 sm:w-56"
          />
        </div>

        <Link
          href="/admin/dashboard/products/new"
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Product</span>
        </Link>
      </div>
    </div>
  );
}
