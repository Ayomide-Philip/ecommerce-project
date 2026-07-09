/* eslint-disable @next/next/no-img-element */
import { fallbackColors } from "@/components/static/fallbackcolours";
import { ProductTypeName } from "@/libs/enums/product.enums";

export default function Page() {
  const categories = (ProductTypeName as readonly string[])
    .filter(Boolean)
    .map((name, idx) => ({
      name,
      img: `/images/${name!.toLowerCase()?.replace(/\s+/g, "-")}.jpg`,
      fallback: fallbackColors[idx % fallbackColors?.length],
    }));

  return (
    <main className="mx-auto w-full max-w-7xl space-y-20 px-3 py-6 pt-20 sm:px-4 sm:pt-24 md:px-6 lg:px-8 lg:py-12 lg:pt-28">
      <div className="flex flex-col gap-8">
        <h1 className="font-display text-4xl font-medium text-cloud text-center sm:text-5xl lg:text-6xl">
          Categories
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href={`/category/${cat.name.toLowerCase()?.replace(/\s+/g, "-")}`}
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
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
