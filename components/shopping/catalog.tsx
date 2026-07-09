import FilterPills from "@/components/FilterPills";
import ProductCard from "@/components/ProductCard";

export default function Catalog() {
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
      prod_name: "Structured Bridal Lace",
      product_type_name: "Bridal",
      price: 180.0,
      detail_desc:
        "Intricate lace overlay with a fitted bodice and a sweeping train — made for the aisle.",
    },
    {
      prod_name: "Retro Court Sneakers",
      product_type_name: "Sneakers",
      price: 84.5,
      detail_desc:
        "Vintage-inspired court sneakers with a clean leather upper and gum sole.",
    },
    {
      prod_name: "Cropped Sport Windbreaker",
      product_type_name: "Sportswear",
      price: 49.0,
      detail_desc:
        "Lightweight water-repellent windbreaker with a cropped cut and reflective accents.",
    },
    {
      prod_name: "Monochrome Senator Set",
      product_type_name: "Traditional",
      price: 77.9,
      detail_desc:
        "A minimalist senator set in monochrome — clean lines, premium fabric, effortless style.",
    },
  ];

  return (
    <section aria-labelledby="catalog-heading" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2
            id="catalog-heading"
            className="font-display text-3xl font-medium text-cloud"
          >
            Browse the catalog
          </h2>
          <p className="mt-1 text-sm text-cloud/55">Discover your next fit</p>
        </div>
      </div>

      <FilterPills filters={catalogFilters} activeFilter="All" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {catalogProducts.map((product) => (
          <ProductCard key={product.prod_name} product={product} />
        ))}
      </div>
    </section>
  );
}
