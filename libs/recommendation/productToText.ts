import type { Product } from "../models/products.models";

export function productToText(product: Product): string {
  return [
    product.product_type_name,
    product.graphical_appearance_name,
    product.colour_group_name,
    product.perceived_colour_master_name,
    product.department_name,
    product.index_name,
    product.detail_desc,
  ]
    .join(" ")
    .toLowerCase();
}
