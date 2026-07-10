// lib/recommendation/user-to-text.ts
import Interactions, { EventType } from "../models/interaction.models";
import Products from "../models/products.models";
import { productToText } from "./productToText";
import { Types } from "mongoose";

const EVENT_WEIGHT: Record<string, number> = {
  [EventType.PURCHASE]: 3,
  [EventType.CLICK]: 2,
  [EventType.VIEW]: 1,
};

export async function buildUserPreferenceText(
  userId: string,
): Promise<string | null> {
  const interactions = await Interactions.find({ userId }).lean();

  if (interactions.length === 0) {
    return null;
  }

  const productIds = [
    ...new Set(interactions.map((i) => i.productId.toString())),
  ];
  const products = await Products.find({ _id: { $in: productIds } }).lean();

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const weightedTextParts: string[] = [];

  for (const interaction of interactions) {
    const product = productMap.get(interaction.productId.toString());
    if (!product) continue;

    const text = productToText(product as any);
    const weight = EVENT_WEIGHT[interaction.eventType] ?? 1;

    for (let i = 0; i < weight; i++) {
      weightedTextParts.push(text);
    }
  }

  return weightedTextParts.join(" ");
}
