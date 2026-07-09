/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from "lucide-react";
import data from "@/data/articles_sample.json";

const imageMap: Record<string, string> = {
  Skirt: "skirt",
  Blouse: "blouse",
  Sweater: "sweater",
  Coat: "coat",
  Trousers: "trousers",
  Shorts: "shorts",
  "T-shirt": "t-shirt",
  "Vest top": "vest-top",
  Dress: "dress",
  Top: "top",
  Shirt: "shirt",
  Jacket: "jacket",
  Cardigan: "cardigan",
  "Underwear bottom": "underwear-bottom",
  Sneakers: "sneakers",
  Socks: "socks",
  "Polo shirt": "polo-shirt",
  Blazer: "blazer",
  Tie: "tie",
  Scarf: "scarf",
  Cap: "cap",
  Watch: "watch",
  Gloves: "gloves",
  Hoodie: "hoodie",
  Slippers: "slippers",
};

const fallbackColors = [
  "from-blue-500/30 to-cyan-500/20",
  "from-amber-500/30 to-orange-500/20",
  "from-rose-400/30 to-pink-500/20",
  "from-teal-500/30 to-emerald-500/20",
  "from-violet-500/30 to-purple-500/20",
  "from-lime-500/30 to-green-500/20",
  "from-yellow-500/30 to-orange-400/20",
  "from-pink-500/30 to-rose-400/20",
  "from-sky-500/30 to-indigo-500/20",
  "from-orange-500/30 to-red-500/20",
];

export default function Categories() {
  const productCounts = data.reduce<Record<string, number>>((acc, item) => {
    const name = item?.product_type_name;
    if (name) acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const categories = [...new Set(data.map((i) => i?.product_type_name))]
    .slice(0, 5)
    .filter(Boolean)
    .map((name, idx) => ({
      name,
      count: productCounts[name!],
      img: `/images/${imageMap[name!] || name!.toLowerCase().replace(/\s+/g, "-")}.jpg`,
      fallback: fallbackColors[idx % fallbackColors.length],
    }));

  return (
    <section aria-labelledby="categories-heading" className="space-y-6">
      <div className="flex items-end justify-between">
        <h2
          id="categories-heading"
          className="font-display text-3xl font-medium text-cloud text-center sm:text-3xl lg:text-4xl"
        >
          Shop by Category
        </h2>
        <a
          href="/category"
          className="hidden items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-cloud/60 transition hover:text-accent sm:inline-flex"
        >
          View All
          <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="group relative aspect-4/5 overflow-hidden rounded-[20px] border border-[rgba(244,244,242,0.08)] bg-panel transition duration-300 hover:border-[rgba(244,244,242,0.18)]"
          >
            <div
              aria-hidden="true"
              className={`absolute inset-0 bg-linear-to-br ${cat.fallback}`}
            />
            <img
              src={cat.img}
              alt={cat.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">
                {cat.count} {cat.count === 1 ? "item" : "items"}
              </p>
              <h3 className="mt-0.5 font-display text-lg font-medium text-white">
                {cat.name}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
