import { InferSchemaType, Schema, models, model } from "mongoose";

export enum EventType {
  CLICK = "click",
  VIEW = "view",
  PURCHASE = "purchase",
}

const interactionSchema = new Schema(
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
    eventType: {
      type: String,
      enum: Object.values(EventType),
      required: true,
    },
  },
  { timestamps: true },
);

interactionSchema.index({ userId: 1, createdAt: -1 });

export type Interaction = InferSchemaType<typeof interactionSchema>;

const Interactions =
  models.Interactions || model("Interactions", interactionSchema);
export default Interactions;
