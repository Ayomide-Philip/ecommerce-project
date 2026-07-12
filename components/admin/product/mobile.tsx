import { Pencil, Trash2 } from "lucide-react";

/* eslint-disable @next/next/no-img-element */
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
  article_id?: string;
};

export default function ProductMobileTable({
  paginatedProducts,
}: {
  paginatedProducts: Product[];
}) {
  return (
    <div className="space-y-3 sm:hidden">
      {paginatedProducts.map((product) => (
        <div
          key={product._id}
          className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60"
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              {product.article_id ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                  <img
                    src={
                      "/images/product_images/" + product.article_id + ".jpg"
                    }
                    alt={product.prod_name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5 text-[10px] font-medium uppercase text-cloud/40 dark:bg-white/5">
                  {product.prod_name.slice(0, 2)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-cloud">
                  {product.prod_name}
                </p>
                <p className="text-xs text-cloud/50">{product._id.slice(-6)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-black/5 pt-3 text-xs dark:border-[rgba(244,244,242,0.05)]">
            <div>
              <span className="block text-cloud/40">Type</span>
              <span className="text-cloud/70 capitalize">
                {product.product_type_name}
              </span>
            </div>
            <div>
              <span className="block text-cloud/40">Colour</span>
              <span className="text-cloud/70">{product.colour_group_name}</span>
            </div>
            <div>
              <span className="block text-cloud/40">Department</span>
              <span className="text-cloud/70 capitalize">
                {product.department_name}
              </span>
            </div>
            <div>
              <span className="block text-cloud/40">Index</span>
              <span className="text-cloud/70 capitalize">
                {product.index_name}
              </span>
            </div>
            <div>
              <span className="block text-cloud/40">Price</span>
              <span className="font-medium text-cloud">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-black/5 pt-3 dark:border-[rgba(244,244,242,0.05)]">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-black/10 py-2 text-xs font-medium text-cloud/60 transition hover:bg-black/5 dark:border-[rgba(244,244,242,0.08)] dark:hover:bg-white/5"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/20 py-2 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
