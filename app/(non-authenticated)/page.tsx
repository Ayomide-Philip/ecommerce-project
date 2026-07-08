import { ArrowUpRight, Sparkles } from "lucide-react";
import FilterPills from "@/components/FilterPills";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";

const recommendedProducts = [
  {
    name: "Midnight Ankara Bomber",
    brand: "Irin Atelier",
    price: "₦72,000",
    category: "Traditional",
    whyMatch: "Because you liked Ankara",
  },
  {
    name: "Oversized Agbada Layer Set",
    brand: "Lagos Fold",
    price: "₦95,500",
    category: "Streetwear",
    whyMatch: "Inspired by your saved fits",
  },
  {
    name: "Textured Kaftan Utility",
    brand: "Northline NG",
    price: "₦64,900",
    category: "Traditional",
    whyMatch: "Based on your recent views",
  },
  {
    name: "Panelled Denim Cargo",
    brand: "Mainland Dept",
    price: "₦58,000",
    category: "Streetwear",
    whyMatch: "Matches your style profile",
  },
];

const catalogFilters = [
  "All",
  "Streetwear",
  "Traditional",
  "Bridal",
  "Sneakers",
  "Sportswear",
];

const catalogProducts = [
  {
    name: "Structured Bridal Lace",
    brand: "Eko Bridal",
    price: "₦180,000",
    category: "Bridal",
  },
  {
    name: "Retro Court Sneakers",
    brand: "Third Mainland",
    price: "₦84,500",
    category: "Sneakers",
  },
  {
    name: "Cropped Sport Windbreaker",
    brand: "GoSlow Club",
    price: "₦49,000",
    category: "Sportswear",
  },
  {
    name: "Monochrome Senator Set",
    brand: "Oja Edit",
    price: "₦77,900",
    category: "Traditional",
  },
];

const categories = [
  {
    name: "Streetwear",
    count: "124 items",
    gradient: "from-blue-500/20 to-cyan-500/10",
    accent: "bg-blue-500/20",
  },
  {
    name: "Traditional",
    count: "86 items",
    gradient: "from-amber-500/20 to-orange-500/10",
    accent: "bg-amber-500/20",
  },
  {
    name: "Bridal",
    count: "42 items",
    gradient: "from-rose-400/20 to-pink-500/10",
    accent: "bg-rose-400/20",
  },
  {
    name: "Sneakers",
    count: "68 items",
    gradient: "from-teal-500/20 to-emerald-500/10",
    accent: "bg-teal-500/20",
  },
  {
    name: "Sportswear",
    count: "53 items",
    gradient: "from-violet-500/20 to-purple-500/10",
    accent: "bg-violet-500/20",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <main className="mx-auto w-full max-w-7xl space-y-20 px-3 py-6 pt-20 sm:px-4 sm:pt-24 md:px-6 lg:px-8 lg:py-12 lg:pt-28">
        <section aria-labelledby="categories-heading" className="space-y-6">
          <div className="flex items-end justify-between">
            <h2
              id="categories-heading"
              className="font-display text-3xl font-medium text-cloud"
            >
              Shop by Category
            </h2>
            <a
              href="#"
              className="hidden items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-cloud/60 transition hover:text-accent sm:inline-flex"
            >
              View All
              <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href="#"
                className="group relative overflow-hidden rounded-[20px] border border-[rgba(244,244,242,0.08)] bg-panel/50 p-5 transition duration-300 hover:border-[rgba(244,244,242,0.18)] hover:bg-panel/80"
              >
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 bg-linear-to-b ${cat.gradient} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative z-10">
                  <span
                    aria-hidden="true"
                    className={`inline-block rounded-full ${cat.accent} px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cloud/80`}
                  >
                    {cat.count}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-medium text-cloud">
                    {cat.name}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </section>

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
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>

        <section aria-labelledby="featured-heading">
          <div className="relative overflow-hidden rounded-3xl border border-[rgba(61,107,255,0.15)] bg-linear-to-br from-accent/10 via-accent/5 to-transparent p-8 sm:p-10 lg:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/5 blur-2xl"
            />

            <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(244,244,242,0.1)] bg-[rgba(244,244,242,0.04)] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-cloud/70">
                  <Sparkles
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-accent"
                  />
                  Limited Drop
                </span>
                <h2
                  id="featured-heading"
                  className="font-display text-3xl font-medium text-cloud sm:text-4xl"
                >
                  The Heritage Collection
                </h2>
                <p className="max-w-lg text-sm text-cloud/65">
                  Where tradition meets the runway — curated pieces that merge
                  Ankara craftsmanship with contemporary streetwear silhouettes.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cloud transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent"
              >
                Explore Drop
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section aria-labelledby="catalog-heading" className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2
                id="catalog-heading"
                className="font-display text-3xl font-medium text-cloud"
              >
                Browse the catalog
              </h2>
              <p className="mt-1 text-sm text-cloud/55">
                Discover your next fit
              </p>
            </div>
          </div>

          <FilterPills filters={catalogFilters} activeFilter="All" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {catalogProducts.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
