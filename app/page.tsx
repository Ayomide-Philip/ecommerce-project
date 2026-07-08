import FilterPills from "@/components/FilterPills";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
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

export default function Home() {
  return (
    <div className="min-h-screen bg-cloud text-panel dark:bg-base dark:text-cloud">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl space-y-14 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Hero />

        <section aria-labelledby="recommended-heading" className="space-y-6">
          <div className="flex items-end justify-between">
            <h2
              id="recommended-heading"
              className="font-display text-3xl font-medium text-panel dark:text-cloud"
            >
              Recommended for you
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>

        <section aria-labelledby="catalog-heading" className="space-y-6">
          <h2
            id="catalog-heading"
            className="font-display text-3xl font-medium text-panel dark:text-cloud"
          >
            Browse the catalog
          </h2>

          <FilterPills filters={catalogFilters} activeFilter="All" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {catalogProducts.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
