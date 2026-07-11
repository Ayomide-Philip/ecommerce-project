import { MoreHorizontal } from "lucide-react";

export default function TopProducts({
  topProducts,
}: {
  topProducts: { name: string; sales: number; revenue: string }[];
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-medium text-cloud">
          Top Products
        </h2>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-cloud/40 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {topProducts.map((product, i) => (
          <div key={product.name} className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/5 text-xs font-medium text-cloud/60 dark:bg-white/5">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-cloud">
                {product.name}
              </p>
              <p className="text-xs text-cloud/50">{product.sales} sales</p>
            </div>
            <span className="shrink-0 text-sm font-medium text-cloud">
              {product.revenue}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
