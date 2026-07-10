import { InferSchemaType, Schema, models, model } from "mongoose";

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
  },
  { timestamps: true },
);

cartSchema.index({ userId: 1, productId: 1 }, { unique: true });
cartSchema.index({ userId: 1, createdAt: -1 });

export type Cart = InferSchemaType<typeof cartSchema>;

const Carts = models.Carts || model("Carts", cartSchema);
export default Carts;
