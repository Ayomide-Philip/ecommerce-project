"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductDesktopTable from "@/components/admin/product/desktop";
import ProductMobileTable from "@/components/admin/product/mobile";
import ProductHeader from "@/components/admin/product/header";

type Product = {
  _id: string;
  prod_name: string;
  product_type_name: string;
  graphical_appearance_name: string;
  colour_group_name: string;
  perceived_colour_value_name: string;
  perceived_colour_master_name: string;
  department_name: string;
  index_name: string;
  detail_desc: string;
  price: number;
};

const ITEMS_PER_PAGE = 10;

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];

  if (current <= 3) {
    pages.push(1, 2, 3, 4, "...", total);
  } else if (current >= total - 2) {
    pages.push(1, "...", total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  return pages;
}

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const request = await fetch("/api/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        const response = await request.json();

        if (!request.ok || response?.error) {
          return toast.error(
            response?.error ||
              "Failed to load products. Please try again later.",
          );
        }
        setProducts(response?.product || []);
      } catch (err) {
        console.log(err);
        return toast.error("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, []);

  const filtered = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.prod_name.toLowerCase().includes(q) ||
      p.product_type_name.toLowerCase().includes(q) ||
      p.graphical_appearance_name.toLowerCase().includes(q) ||
      p.colour_group_name.toLowerCase().includes(q) ||
      p.perceived_colour_value_name.toLowerCase().includes(q) ||
      p.perceived_colour_master_name.toLowerCase().includes(q) ||
      p.department_name.toLowerCase().includes(q) ||
      p.index_name.toLowerCase().includes(q) ||
      p.price.toString().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedProducts = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-cloud/10 border-t-accent"
            role="status"
            aria-label="Loading products"
          />
          <p className="text-xs text-cloud/40">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
      <ProductHeader
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        productLength={filtered.length}
      />

      <ProductDesktopTable paginatedProducts={paginatedProducts} />

      <ProductMobileTable paginatedProducts={paginatedProducts} />

      {filtered.length === 0 && (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-cloud/10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cloud/30">
            No products match your search
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-between sm:mt-6">
          <p className="text-xs text-cloud/50">
            Showing {startIndex + 1}–
            {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of{" "}
            {filtered.length} products
          </p>
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium text-cloud/50 transition hover:bg-black/5 hover:text-cloud disabled:opacity-30 disabled:cursor-not-allowed dark:hover:bg-white/5"
            >
              ‹
            </button>

            {getPageNumbers(currentPage, totalPages).map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center text-xs text-cloud/30"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page as number)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium transition ${
                    page === currentPage
                      ? "bg-accent/10 text-accent"
                      : "text-cloud/50 hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium text-cloud/50 transition hover:bg-black/5 hover:text-cloud disabled:opacity-30 disabled:cursor-not-allowed dark:hover:bg-white/5"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
