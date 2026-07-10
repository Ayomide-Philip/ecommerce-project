/**
 * Popularity-Based Fallback Recommendations
 *
 * When a user has no interaction history (cold start), we cannot compute
 * personalised recommendations. Instead, we return the most popular products
 * based on total interaction count across all users.
 *
 * This uses MongoDB's aggregation pipeline to:
 *   1. Group interactions by productId and count them.
 *   2. Sort by count descending.
 *   3. Limit to the top N products.
 *   4. Look up full product details from the Products collection.
 */

import Interactions from "../models/interaction.models";
import type { Product } from "../models/products.models";

/**
 * Fetches the top-N most interacted-with products as a cold-start fallback.
 *
 * @param topN - Number of products to return (default 8).
 * @returns Array of full product documents (with a `_doc`-compatible shape
 *          from the aggregation).
 */
export async function getPopularityFallback(topN = 8): Promise<Product[]> {
  const results = await Interactions.aggregate([
    // Step 1: Group by productId and count total interactions per product
    {
      $group: {
        _id: "$productId",
        interactionCount: { $sum: 1 },
      },
    },
    // Step 2: Sort by popularity descending
    { $sort: { interactionCount: -1 } },
    // Step 3: Keep only the top N
    { $limit: topN },
    // Step 4: Join with the Products collection to get full product details
    {
      $lookup: {
        from: "products", // MongoDB collection name (Mongoose pluralises "Products")
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    // Step 5: Unwind the product array (one product per result)
    { $unwind: "$product" },
    // Step 6: Replace the root with the product document (drop the
    // interactionCount wrapper, keeping only the product data)
    { $replaceRoot: { newRoot: "$product" } },
  ]);

  return results as unknown as Product[];
}
