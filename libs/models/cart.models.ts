import { Schema, models, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    hasPurchased: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

const Carts = models.Carts || model("Carts", cartSchema);
export default Carts;
