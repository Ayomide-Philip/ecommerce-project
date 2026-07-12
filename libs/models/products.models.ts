import { InferSchemaType, model, models, Schema } from "mongoose";
import {
  ProductTypeName,
  GraphicalAppearanceName,
  ColourGroupName,
  PerceivedColourValueName,
  PerceivedColourMasterName,
  DepartmentName,
  IndexName,
} from "../enums/product.enums";

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
      enum: ProductTypeName,
    },
    graphical_appearance_name: {
      type: String,
      required: true,
      enum: GraphicalAppearanceName,
    },
    colour_group_name: {
      type: String,
      required: true,
      enum: ColourGroupName,
    },
    perceived_colour_value_name: {
      type: String,
      required: true,
      enum: PerceivedColourValueName,
    },
    perceived_colour_master_name: {
      type: String,
      required: true,
      enum: PerceivedColourMasterName,
    },
    department_name: {
      type: String,
      required: true,
      enum: DepartmentName,
    },
    index_name: {
      type: String,
      required: true,
      enum: IndexName,
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
    article_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export type Product = InferSchemaType<typeof productSchema>;

const Products = models.Products || model("Products", productSchema);
export default Products;
