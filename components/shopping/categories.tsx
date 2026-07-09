/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProductTypeName } from "@/libs/enums/product.enums";
import { fallbackColors } from "../static/fallbackcolours";

export default function Categories() {
  const categories = (ProductTypeName as readonly string[])
    .slice(0, 5)
    .filter(Boolean)
    .map((name, idx) => ({
      name,
      img: `/images/${name!.toLowerCase()?.replace(/\s+/g, "-")}.jpg`,
      fallback: fallbackColors[idx % fallbackColors?.length],
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
        <Link
          href="/category"
          className="hidden items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-cloud/60 transition hover:text-accent sm:inline-flex"
        >
          View All
          <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => (
          <Link
            key={cat?.name}
            href={`/category/${cat?.name.toLowerCase()?.replace(/\s+/g, "-")}`}
            className="group relative aspect-4/5 overflow-hidden rounded-[20px] border border-[rgba(244,244,242,0.08)] bg-panel transition duration-300 hover:border-[rgba(244,244,242,0.18)]"
          >
            <div
              aria-hidden="true"
              className={`absolute inset-0 bg-linear-to-br ${cat?.fallback}`}
            />
            <img
              src={cat?.img}
              alt={cat?.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="mt-0.5 font-display text-lg font-medium text-white">
                {cat?.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
