import { InferSchemaType, Schema, models, model } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtPurchase: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => v.length > 0,
        message: "Order must have at least one item.",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid"],
      default: "paid",
    },
    paymentMethod: {
      type: String,
      default: "dummy-card",
    },
  },
  { timestamps: true },
);

orderSchema.index({ userId: 1, createdAt: -1 });

export type Order = InferSchemaType<typeof orderSchema>;

const Orders = models.Orders || model("Orders", orderSchema);
export default Orders;
