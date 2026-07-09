import { InferSchemaType, model, models, Schema } from "mongoose";

const productSchema = new Schema(
  {
    prod_name: {
      type: String,
      required: true,
      lowercase: true,
    },
    product_type_name: {
      type: String,
      required: true,
      lowercase: true,
    },
    graphical_appearance_name: {
      type: String,
      required: true,
      lowercase: true,
    },
    colour_group_name: {
      type: String,
      required: true,
      lowercase: true,
    },
    perceived_colour_value_name: {
      type: String,
      required: true,
      lowercase: true,
    },
    perceived_colour_master_name: {
      type: String,
      required: true,
      lowercase: true,
    },
    department_name: {
      type: String,
      required: true,
      lowercase: true,
    },
    index_name: {
      type: String,
      required: true,
      lowercase: true,
    },
    detail_desc: {
      type: String,
      required: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export type Product = InferSchemaType<typeof productSchema>;

const Products = models.Products || model("Products", productSchema);
export default Products;
