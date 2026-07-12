import {
  // Pencil,
  Trash2,
} from "lucide-react";
import { CldImage } from "next-cloudinary";

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

export default function ProductDesktopTable({
  paginatedProducts,
}: {
  paginatedProducts: Product[];
}) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-black/10 bg-white/80 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60 sm:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-black/5 text-xs uppercase tracking-wider text-cloud/40 dark:border-[rgba(244,244,242,0.08)] dark:bg-white/5">
            <th className="py-3 pl-4 pr-4 font-medium sm:pl-6">Product</th>
            <th className="py-3 pr-4 font-medium">Type</th>
            <th className="py-3 pr-4 font-medium">Colour</th>
            <th className="py-3 pr-4 font-medium">Department</th>
            <th className="py-3 pr-4 font-medium">Index</th>
            <th className="py-3 pr-4 font-medium">Price</th>

            <th className="py-3 pr-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product, idx) => (
            <tr
              key={idx}
              className="border-b border-black/5 last:border-0 dark:border-[rgba(244,244,242,0.05)]"
            >
              <td className="py-3 pl-4 pr-4 sm:pl-6">
                <div className="flex items-center gap-3">
                  {product.article_id ? (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                      <CldImage
                        src={product.article_id}
                        alt={product.prod_name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        width={400}
                        height={400}
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5 text-[10px] font-medium uppercase text-cloud/40 dark:bg-white/5">
                      {product.prod_name.slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-cloud">
                      {product.prod_name}
                    </p>
                    <p className="text-xs text-cloud/50">
                      {product._id.slice(-6)}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 pr-4 text-cloud/70 capitalize">
                {product.product_type_name}
              </td>
              <td className="py-3 pr-4 text-cloud/70">
                <span>{product.colour_group_name}</span>
                <span className="text-cloud/40">
                  {" "}
                  / {product.perceived_colour_master_name}
                </span>
              </td>
              <td className="py-3 pr-4 text-cloud/70 capitalize">
                {product.department_name}
              </td>
              <td className="py-3 pr-4 text-cloud/70 capitalize">
                {product.index_name}
              </td>
              <td className="py-3 pr-4 font-medium text-cloud">
                ${product.price.toFixed(2)}
              </td>

              <td className="py-3 pr-4">
                <div className="flex items-center gap-1">
                  {/* <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-cloud/40 transition hover:bg-black/5 hover:text-accent dark:hover:bg-white/5"
                  >
                    <Pencil className="h-4 w-4" />
                  </button> */}
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-cloud/40 transition hover:bg-black/5 hover:text-red-500 dark:hover:bg-white/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
