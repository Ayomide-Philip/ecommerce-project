"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, MoreHorizontal } from "lucide-react";

// ── Mock Data (matches MongoDB model fields) ──────────

type Product = {
  _id: string;
  prod_name: string;
  product_type_name: string;
  price: number;
  detail_desc: string;
  stock: number;
  status: "Active" | "Draft" | "Out of Stock";
};

const allProducts: Product[] = [
  {
    _id: "6a4fd493074e5ffa612d919c",
    prod_name: "Basic Dress Fit",
    product_type_name: "dress",
    price: 248.99,
    detail_desc:
      "Calf-length, sleeveless dress in a patterned weave with an elasticated frill trim.",
    stock: 34,
    status: "Active",
  },
  {
    _id: "6a4fd493074e5ffa612d919d",
    prod_name: "PE HALLE BOTTOMS",
    product_type_name: "underwear bottom",
    price: 297.99,
    detail_desc:
      "Briefs in an airy silk blend with lace sections, an elasticated waist and lined gusset.",
    stock: 23,
    status: "Active",
  },
  {
    _id: "6a4fd493074e5ffa612d919e",
    prod_name: "Winona Cardigan",
    product_type_name: "cardigan",
    price: 224.0,
    detail_desc:
      "Long, fine-knit cardigan in a soft viscose blend with long sleeves and ribbed cuffs.",
    stock: 18,
    status: "Active",
  },
  {
    _id: "6a4fd493074e5ffa612d919f",
    prod_name: "Elegant Trousers Line",
    product_type_name: "trousers",
    price: 231.0,
    detail_desc:
      "Ankle-length trousers in twill with a slight sheen. Mid waist with elastication.",
    stock: 52,
    status: "Active",
  },
  {
    _id: "6a4fd493074e5ffa612d91a0",
    prod_name: "Classic Underwear Bottom Wear",
    product_type_name: "underwear bottom",
    price: 249.99,
    detail_desc:
      "Briefs in an airy silk blend with lace sections, an elasticated waist.",
    stock: 67,
    status: "Active",
  },
  {
    _id: "6a4fd493074e5ffa612d91a1",
    prod_name: "Classic Slippers Collection",
    product_type_name: "slippers",
    price: 11.0,
    detail_desc:
      "Imitation suede slippers with soft pile linings and fluted soles.",
    stock: 0,
    status: "Out of Stock",
  },
  {
    _id: "6a4fd493074e5ffa612d91a2",
    prod_name: "Basic Skirt Edition",
    product_type_name: "skirt",
    price: 89.99,
    detail_desc:
      "A-line skirt in a woven fabric with a concealed zip at the back.",
    stock: 41,
    status: "Draft",
  },
  {
    _id: "6a4fd493074e5ffa612d91a3",
    prod_name: "Casual Blazer Style",
    product_type_name: "blazer",
    price: 179.0,
    detail_desc:
      "Single-breasted blazer in a comfortable stretch weave with notched lapels.",
    stock: 12,
    status: "Active",
  },
  {
    _id: "6a4fd493074e5ffa612d91a4",
    prod_name: "Printed Maxi Dress",
    product_type_name: "dress",
    price: 312.0,
    detail_desc:
      "Floor-length dress with an all-over print, short puff sleeves and a gathered waist.",
    stock: 8,
    status: "Active",
  },
  {
    _id: "6a4fd493074e5ffa612d91a5",
    prod_name: "Leather Crossbody Bag",
    product_type_name: "bag",
    price: 145.0,
    detail_desc:
      "Genuine leather crossbody bag with an adjustable strap and zip closure.",
    stock: 29,
    status: "Active",
  },
];

const ITEMS_PER_PAGE = 10;

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Draft: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  "Out of Stock": "bg-red-500/10 text-red-600 dark:text-red-400",
};

// ── Component ──────────────────────────────────────────

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = allProducts.filter(
    (p) =>
      p.prod_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p._id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset to page 1 when searching
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-medium text-cloud sm:text-3xl">
            Products
          </h1>
          <p className="mt-0.5 text-xs text-cloud/50 sm:mt-1 sm:text-sm">
            Manage your product catalog — {allProducts.length} total items
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

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden overflow-hidden rounded-2xl border border-black/10 bg-white/80 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60 sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-black/5 text-xs uppercase tracking-wider text-cloud/40 dark:border-[rgba(244,244,242,0.08)] dark:bg-white/5">
              <th className="py-3 pl-4 pr-4 font-medium sm:pl-6">Product</th>
              <th className="py-3 pr-4 font-medium">Category</th>
              <th className="py-3 pr-4 font-medium">Price</th>
              <th className="py-3 pr-4 font-medium">Stock</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product._id}
                className="border-b border-black/5 last:border-0 dark:border-[rgba(244,244,242,0.05)]"
              >
                <td className="py-3 pl-4 pr-4 sm:pl-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5 text-[10px] font-medium uppercase text-cloud/40 dark:bg-white/5">
                      {product.prod_name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-cloud">
                        {product.prod_name}
                      </p>
                      <p className="text-xs text-cloud/50">
                        {product._id.slice(-6)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-cloud/70">
                  {product.product_type_name}
                </td>
                <td className="py-3 pr-4 font-medium text-cloud">
                  ${product.price.toFixed(2)}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`text-sm ${
                      product.stock === 0
                        ? "text-red-500"
                        : product.stock < 20
                          ? "text-amber-500"
                          : "text-cloud/70"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      statusStyles[product.status]
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-cloud/40 transition hover:bg-black/5 hover:text-accent dark:hover:bg-white/5"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-cloud/40 transition hover:bg-black/5 hover:text-red-500 dark:hover:bg-white/5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-cloud/40 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="space-y-3 sm:hidden">
        {paginatedProducts.map((product) => (
          <div
            key={product._id}
            className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5 text-[10px] font-medium uppercase text-cloud/40 dark:bg-white/5">
                  {product.prod_name.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-cloud">
                    {product.prod_name}
                  </p>
                  <p className="text-xs text-cloud/50">
                    {product._id.slice(-6)}
                  </p>
                </div>
              </div>
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  statusStyles[product.status]
                }`}
              >
                {product.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-black/5 pt-3 text-xs dark:border-[rgba(244,244,242,0.05)]">
              <div>
                <span className="block text-cloud/40">Category</span>
                <span className="text-cloud/70">
                  {product.product_type_name}
                </span>
              </div>
              <div>
                <span className="block text-cloud/40">Price</span>
                <span className="font-medium text-cloud">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="block text-cloud/40">Stock</span>
                <span
                  className={
                    product.stock === 0
                      ? "text-red-500"
                      : product.stock < 20
                        ? "text-amber-500"
                        : "text-cloud/70"
                  }
                >
                  {product.stock}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-black/5 pt-3 dark:border-[rgba(244,244,242,0.05)]">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-black/10 py-2 text-xs font-medium text-cloud/60 transition hover:bg-black/5 dark:border-[rgba(244,244,242,0.08)] dark:hover:bg-white/5"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/20 py-2 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Empty State ── */}
      {filtered.length === 0 && (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-cloud/10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cloud/30">
            No products match your search
          </p>
        </div>
      )}

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-between sm:mt-6">
          <p className="text-xs text-cloud/50">
            Showing {startIndex + 1}–
            {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of{" "}
            {allProducts.length} products
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-cloud/50 transition hover:bg-black/5 hover:text-cloud disabled:opacity-30 disabled:cursor-not-allowed dark:hover:bg-white/5"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                  page === currentPage
                    ? "bg-accent/10 text-accent"
                    : "text-cloud/50 hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-cloud/50 transition hover:bg-black/5 hover:text-cloud disabled:opacity-30 disabled:cursor-not-allowed dark:hover:bg-white/5"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
