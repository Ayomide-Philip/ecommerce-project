/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from "lucide-react";
import data from "@/data/articles_sample.json";

const categoryImage: Record<string, string> = {
  Skirt:
    "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop",
  Blouse:
    "https://images.unsplash.com/photo-1608236415057-4f2ca7b6e302?w=400&h=500&fit=crop",
  Sweater:
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop",
  Coat: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
  Trousers:
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
  Shorts:
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop",
  "T-shirt":
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
  "Vest top":
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop",
  Dress:
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
  Top: "https://images.unsplash.com/photo-1582412467521-1c3c36a20499?w=400&h=500&fit=crop",
  Shirt:
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
  Jacket:
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
  Cardigan:
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
  "Underwear bottom":
    "https://images.unsplash.com/photo-1623091411395-4d94b467b8f3?w=400&h=500&fit=crop",
  Sneakers:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
  Socks:
    "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=500&fit=crop",
  "Polo shirt":
    "https://images.unsplash.com/photo-1594938328870-9623159f8dd4?w=400&h=500&fit=crop",
  Blazer:
    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=500&fit=crop",
  Tie: "https://images.unsplash.com/photo-1599894012840-92e6b2d79376?w=400&h=500&fit=crop",
  Scarf:
    "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop",
  "Cap/peaked":
    "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop",
  Watch:
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop",
  Gloves:
    "https://images.unsplash.com/photo-1556147660-3e8f5f8db1f2?w=400&h=500&fit=crop",
  Hoodie:
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
  Slippers:
    "https://images.unsplash.com/photo-1600166898405-da2545205e29?w=400&h=500&fit=crop",
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
    .filter(Boolean)
    .map((name, idx) => ({
      name,
      count: productCounts[name!],
      img:
        categoryImage[name!] || `https://picsum.photos/seed/${name!}/400/500`,
      fallback: fallbackColors[idx % fallbackColors.length],
    }));

  return (
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href="#"
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
