"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, MoreHorizontal } from "lucide-react";

// ── Mock Data ──────────────────────────────────────────

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Out of Stock";
  image: string;
};

const products: Product[] = [
  {
    id: "#PRD-1024",
    name: "Basic Dress Fit",
    category: "Dress",
    price: 248.99,
    stock: 34,
    status: "Active",
    image: "dress",
  },
  {
    id: "#PRD-1023",
    name: "Elegant Trousers Line",
    category: "Trousers",
    price: 231.0,
    stock: 52,
    status: "Active",
    image: "trousers",
  },
  {
    id: "#PRD-1022",
    name: "Winona Cardigan",
    category: "Cardigan",
    price: 224.0,
    stock: 18,
    status: "Active",
    image: "cardigan",
  },
  {
    id: "#PRD-1021",
    name: "Classic Slippers Collection",
    category: "Slippers",
    price: 11.0,
    stock: 0,
    status: "Out of Stock",
    image: "slippers",
  },
  {
    id: "#PRD-1020",
    name: "Classic Underwear Bottom Wear",
    category: "Underwear",
    price: 249.99,
    stock: 67,
    status: "Active",
    image: "underwear",
  },
  {
    id: "#PRD-1019",
    name: "Basic Skirt Edition",
    category: "Skirt",
    price: 89.99,
    stock: 41,
    status: "Draft",
    image: "skirt",
  },
  {
    id: "#PRD-1018",
    name: "PE HALLE BOTTOMS",
    category: "Underwear",
    price: 297.99,
    stock: 23,
    status: "Active",
    image: "underwear",
  },
  {
    id: "#PRD-1017",
    name: "Casual Blazer Style",
    category: "Blazer",
    price: 179.0,
    stock: 12,
    status: "Active",
    image: "blazer",
  },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Draft: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  "Out of Stock": "bg-red-500/10 text-red-600 dark:text-red-400",
};

// ── Component ──────────────────────────────────────────

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-medium text-cloud sm:text-3xl">
            Products
          </h1>
          <p className="mt-0.5 text-xs text-cloud/50 sm:mt-1 sm:text-sm">
            Manage your product catalog — {products.length} total items
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cloud/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            {filtered.map((product) => (
              <tr
                key={product.id}
                className="border-b border-black/5 last:border-0 dark:border-[rgba(244,244,242,0.05)]"
              >
                <td className="py-3 pl-4 pr-4 sm:pl-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5 text-[10px] font-medium uppercase text-cloud/40 dark:bg-white/5">
                      {product.image.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-cloud">{product.name}</p>
                      <p className="text-xs text-cloud/50">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-cloud/70">{product.category}</td>
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
        {filtered.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5 text-[10px] font-medium uppercase text-cloud/40 dark:bg-white/5">
                  {product.image.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-cloud">
                    {product.name}
                  </p>
                  <p className="text-xs text-cloud/50">{product.id}</p>
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
                <span className="text-cloud/70">{product.category}</span>
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
            Showing 1–{filtered.length} of {products.length} products
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-cloud/50 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
            >
              ‹
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-xs font-medium text-accent"
            >
              1
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-cloud/50 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
            >
              2
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-cloud/50 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
            >
              3
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-cloud/50 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
