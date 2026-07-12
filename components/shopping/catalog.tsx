"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CatalogFilterSidebar from "./catalog/filterSideBar";
import {
  ColourGroupName,
  DepartmentName,
  GraphicalAppearanceName,
  ProductTypeName,
} from "@/libs/enums/product.enums";
import { toast } from "sonner";
import Loading from "../loading";
import { Product } from "@/libs/models/products.models";

type ProductExtend = Product & {
  _id: string;
  article_id?: string;
};

export default function Catalog() {
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(18);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductExtend[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const request = await fetch(`/api/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "default",
        });

        const response = await request.json();
        if (!request.ok || response?.error) {
          return toast.error(
            response?.error ||
              "Failed to fetch products. Please try again later.",
          );
        }
        setLoading(false);
        setProducts(response?.product || []);
      } catch (err) {
        console.log(err);
        return toast.error("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const categories = useMemo(
    () => [...(ProductTypeName as readonly string[])].sort(),
    [],
  );
  const colors = useMemo(
    () => [...(ColourGroupName as readonly string[])].sort(),
    [],
  );
  const patterns = useMemo(
    () => [...(GraphicalAppearanceName as readonly string[])].sort(),
    [],
  );
  const departments = useMemo(
    () => [...(DepartmentName as readonly string[])].sort(),
    [],
  );

  const filtered = useMemo(() => {
    let result = products as Product[];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item?.prod_name?.toLowerCase()?.includes(q) ||
          item?.product_type_name?.toLowerCase()?.includes(q) ||
          item?.colour_group_name?.toLowerCase()?.includes(q) ||
          item?.graphical_appearance_name?.toLowerCase()?.includes(q) ||
          item?.department_name?.toLowerCase()?.includes(q),
      );
    }
    if (selectedCategories.length > 0) {
      const lowered = selectedCategories.map((c) => c.toLowerCase());
      result = result.filter((item) =>
        lowered.includes(item.product_type_name.toLowerCase()),
      );
    }
    if (selectedColors.length > 0) {
      const lowered = selectedColors.map((c) => c.toLowerCase());
      result = result.filter((item) =>
        lowered.includes(item.colour_group_name.toLowerCase()),
      );
    }
    if (selectedPatterns.length > 0) {
      const lowered = selectedPatterns.map((p) => p.toLowerCase());
      result = result.filter((item) =>
        lowered.includes(item.graphical_appearance_name.toLowerCase()),
      );
    }
    if (selectedDepartments.length > 0) {
      const lowered = selectedDepartments.map((d) => d.toLowerCase());
      result = result.filter((item) =>
        lowered.includes(item.department_name.toLowerCase()),
      );
    }

    return result;
  }, [
    searchQuery,
    selectedCategories,
    selectedColors,
    selectedPatterns,
    selectedDepartments,
    products,
  ]);

  const visibleProducts = filtered.slice(0, visibleCount) as ProductExtend[];
  const hasMore = visibleCount < filtered.length;

  const toggleFilter = (
    arr: string[],
    setter: (v: string[]) => void,
    value: string,
  ) => {
    setter(
      arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    );
    setVisibleCount(20);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedPatterns([]);
    setSelectedDepartments([]);
    setSearchQuery("");
    setVisibleCount(20);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedPatterns.length > 0 ||
    selectedDepartments.length > 0;

  const activeCount =
    selectedCategories.length +
    selectedColors.length +
    selectedPatterns.length +
    selectedDepartments.length;

  if (loading) return <Loading />;

  return (
    <section aria-labelledby="catalog-heading" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="catalog-heading"
            className="font-display text-2xl font-medium text-cloud sm:text-3xl"
          >
            Browse the catalog
          </h2>
          <p className="mt-1 text-sm text-cloud/55">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}{" "}
            found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(20);
              }}
              placeholder="Search…"
              className="w-full rounded-xl border border-black/12 bg-panel py-3 pl-11 pr-4 font-mono text-sm text-cloud placeholder:text-cloud/30 transition focus:outline-none focus:ring-2 focus:ring-accent/60 dark:border-[rgba(244,244,242,0.12)] sm:w-64"
            />
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="glass relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-cloud/70 transition hover:bg-[rgba(244,244,242,0.12)] lg:hidden"
          >
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] text-cloud">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-28 space-y-6 rounded-2xl border border-[rgba(244,244,242,0.08)] bg-panel/50 p-5">
            <CatalogFilterSidebar
              hasActiveFilters={hasActiveFilters}
              clearAllFilters={clearAllFilters}
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              colors={colors}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              patterns={patterns}
              selectedPatterns={selectedPatterns}
              setSelectedPatterns={setSelectedPatterns}
              departments={departments}
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
              toggleFilter={toggleFilter}
            />
          </div>
        </aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-[rgba(244,244,242,0.08)] bg-base p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
                  Filters
                </p>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="glass inline-flex h-8 w-8 items-center justify-center rounded-full"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              <CatalogFilterSidebar
                hasActiveFilters={hasActiveFilters}
                clearAllFilters={clearAllFilters}
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                colors={colors}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                patterns={patterns}
                selectedPatterns={selectedPatterns}
                setSelectedPatterns={setSelectedPatterns}
                departments={departments}
                selectedDepartments={selectedDepartments}
                setSelectedDepartments={setSelectedDepartments}
                toggleFilter={toggleFilter}
              />
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {!loading &&
              visibleProducts.map((product, idx) => (
                <ProductCard
                  key={product._id || idx}
                  product={product as ProductExtend}
                />
              ))}
          </div>

          {!loading && visibleProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="font-display text-xl text-cloud/40">
                No products found
              </p>
              <p className="mt-1 text-sm text-cloud/30">
                Try adjusting your filters
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 glass inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-cloud/60 transition hover:text-cloud"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center pt-8">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="glass inline-flex items-center gap-2 rounded-full px-8 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cloud/70 transition hover:bg-[rgba(244,244,242,0.12)] hover:text-cloud"
              >
                See More ({filtered.length - visibleCount} left)
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
