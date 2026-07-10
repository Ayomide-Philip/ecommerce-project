/**
 * Cosine Similarity
 *
 * Measures the similarity between two non-zero vectors by calculating the
 * cosine of the angle between them:
 *
 *   cos(θ) = (A · B) / (‖A‖ × ‖B‖)
 *
 * Where:
 *   A · B   = dot product of vectors A and B
 *   ‖A‖     = Euclidean magnitude (length) of vector A
 *
 * The result ranges from -1 (completely opposite) to 1 (identical direction).
 * For TF-IDF vectors (which are non-negative), the result is between 0 and 1.
 *
 * A value close to 1 means the two items are very similar in terms of their
 * content attributes.
 */

/**
 * Computes the cosine similarity between two equal-length numeric vectors.
 * Returns 0 if either vector is all zeros (avoids NaN from division by zero).
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error(
      `Vectors must have the same length (got ${vecA.length} and ${vecB.length})`,
    );
  }

  // Dot product: sum of element-wise products
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }

  // Magnitude (Euclidean norm) of vector A
  let magnitudeA = 0;
  for (let i = 0; i < vecA.length; i++) {
    magnitudeA += vecA[i] * vecA[i];
  }
  magnitudeA = Math.sqrt(magnitudeA);

  // Magnitude (Euclidean norm) of vector B
  let magnitudeB = 0;
  for (let i = 0; i < vecB.length; i++) {
    magnitudeB += vecB[i] * vecB[i];
  }
  magnitudeB = Math.sqrt(magnitudeB);

  // Edge case: if either vector is all zeros, similarity is 0
  // (prevents NaN from 0 / 0)
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}
