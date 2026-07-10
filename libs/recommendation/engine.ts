/**
 * Content-Based Recommendation Engine
 *
 * This is the main orchestrator that ties together all the recommendation
 * components:
 *
 *   1. A product catalogue is converted to TF-IDF vectors (one vector per
 *      product) and cached in memory.
 *   2. A user's interaction history (clicks, views, purchases) is converted
 *      to a single "preference text" which is then vectorised against the
 *      same vocabulary.
 *   3. Cosine similarity is computed between the user's vector and every
 *      product vector.
 *   4. The top-N most similar products are returned.
 *
 * If the user has no interaction history (cold start), a popularity-based
 * fallback is used instead.
 */

import Products, { type Product } from "../models/products.models";
import { productToText } from "./productToText";
import { buildUserPreferenceText } from "./user-to-text";
import { computeIDF, computeTFIDF, vectorizeAgainstVocabulary } from "./tfidf";
import { cosineSimilarity } from "./cosine-similarity";
import { getPopularityFallback } from "./popularity-fallback";

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------
// A simple in-memory module-level cache. Set to `null` to trigger a rebuild
// on the next request. This is a prototype-only approach — a production system
// would use Redis or similar.

type CacheEntry = {
  products: Product[];
  vocabulary: string[];
  idfValues: number[];
  productVectors: Map<string, number[]>;
  lastBuiltAt: Date;
};

let cache: CacheEntry | null = null;

// ---------------------------------------------------------------------------
// buildCache
// ---------------------------------------------------------------------------

/**
 * Fetches all products from the database, converts each to a text
 * fingerprint via `productToText()`, computes TF-IDF vectors across the
 * entire catalogue, and stores the result in the module-level cache.
 */
async function buildCache(): Promise<void> {
  // Fetch all products
  const products = await Products.find({}).lean();

  // Convert each product to its text fingerprint
  const documents: string[] = products.map((product) =>
    productToText(product as unknown as Product),
  );

  // Compute TF-IDF across all product documents
  const { vocabulary, vectors } = computeTFIDF(documents);

  // Build a Map from product ID string -> its TF-IDF vector
  const productVectors = new Map<string, number[]>();
  for (let i = 0; i < products.length; i++) {
    const productId = (products[i]._id as string).toString();
    productVectors.set(productId, vectors[i]);
  }

  // Extract the IDF values separately so we can reuse them later when
  // vectorising a user's preference text against the same vocabulary.
  const idfValues = computeIDF(documents, vocabulary);

  cache = {
    products: products as unknown as Product[],
    vocabulary,
    idfValues,
    productVectors,
    lastBuiltAt: new Date(),
  };
}

/**
 * Manually invalidates (clears) the in-memory cache.
 * Call this from admin product create/update/delete routes so the cache
 * rebuilds with fresh data on the next recommendation request.
 */
export async function invalidateCache(): Promise<void> {
  cache = null;
}

// ---------------------------------------------------------------------------
// getRecommendations (public API)
// ---------------------------------------------------------------------------

/**
 * Returns personalised product recommendations for a given user.
 *
 * How it works:
 *   1. If the in-memory cache is empty, build it from all products in the DB.
 *   2. Fetch the user's interaction history and build a preference text.
 *   3. If there is no history (cold start), fall back to popular products.
 *   4. Otherwise, vectorise the user's preference text against the existing
 *      product vocabulary, then compute cosine similarity against every
 *      cached product vector.
 *   5. Sort by similarity (descending) and return the top-N product objects.
 *
 * @param userId - The MongoDB ObjectId string of the target user.
 * @param topN   - Number of recommendations to return (default 8).
 * @returns An array of full product documents.
 */
export async function getRecommendations(
  userId: string,
  topN = 8,
): Promise<Product[]> {
  // Step 1: Ensure the cache is populated
  if (!cache) {
    await buildCache();
  }

  // Step 2: Try to build a preference text from the user's interaction history
  const userPreferenceText = await buildUserPreferenceText(userId);

  // Step 3: Cold start — no interaction history, use popularity fallback
  if (!userPreferenceText) {
    const popular = await getPopularityFallback(topN);
    return popular;
  }

  // Safety check — cache is guaranteed non-null after buildCache()
  const { vocabulary, idfValues, productVectors, products } = cache!;

  // Step 4: Vectorise the user's preference text against the SAME vocabulary
  //         that was used for the product vectors, so dimensions align.
  const userVector = vectorizeAgainstVocabulary(
    userPreferenceText,
    vocabulary,
    idfValues,
  );

  // Step 5: Compute similarity between the user vector and every product
  type ScoredProduct = { product: Product; score: number };
  const scored: ScoredProduct[] = [];

  for (const product of products) {
    const productId = (product as any)._id.toString();
    const productVector = productVectors.get(productId);

    if (!productVector) continue; // Safety skip (shouldn't happen)

    const score = cosineSimilarity(userVector, productVector);
    scored.push({ product, score });
  }

  // Step 6: Sort by similarity score descending and take the top N
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN).map((entry) => entry.product);
}
