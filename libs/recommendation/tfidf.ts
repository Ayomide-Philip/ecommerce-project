/**
 * TF-IDF (Term Frequency — Inverse Document Frequency) implementation.
 *
 * TF-IDF is a numerical statistic that reflects how important a word is to a
 * document within a collection (corpus) of documents. It is the product of two
 * factors:
 *   - Term Frequency (TF): how often a term appears in a single document.
 *   - Inverse Document Frequency (IDF): how rare or common a term is across
 *     the entire corpus — rare terms get a higher weight.
 *
 * All functions are pure TypeScript with zero external dependencies so the
 * math is fully visible and explainable.
 */

/**
 * Splits a text string into an array of tokens (words) by whitespace.
 * Empty strings produce an empty array.
 */
export function tokenize(text: string): string[] {
  return text.trim() ? text.trim().split(/\s+/) : [];
}

/**
 * Builds a sorted vocabulary of unique words that appear across all documents.
 * A "document" is one element of the input array (e.g. one product's text).
 */
export function buildVocabulary(documents: string[]): string[] {
  const uniqueWords = new Set<string>();

  for (const doc of documents) {
    for (const word of tokenize(doc)) {
      uniqueWords.add(word);
    }
  }

  // Return a sorted array so the vocabulary order is deterministic
  return [...uniqueWords].sort();
}

/**
 * Computes the Term Frequency (TF) for each word in a single document.
 *
 * TF(word, doc) = (number of times 'word' appears in 'doc') /
 *                  (total number of words in 'doc')
 *
 * This normalises the count so that longer documents don't dominate.
 */
export function computeTermFrequencies(
  docText: string,
  vocabulary: string[],
): number[] {
  const words = tokenize(docText);
  const totalWords = words.length;

  // Count raw occurrences of each word in this document
  const rawCounts = new Map<string, number>();
  for (const word of words) {
    rawCounts.set(word, (rawCounts.get(word) ?? 0) + 1);
  }

  // Build the TF vector aligned to the vocabulary order
  return vocabulary.map((word) => {
    const count = rawCounts.get(word) ?? 0;
    return totalWords > 0 ? count / totalWords : 0;
  });
}

/**
 * Computes the Inverse Document Frequency (IDF) for every word in the
 * vocabulary.
 *
 * IDF(word) = ln((N + 1) / (df + 1)) + 1
 *
 * Where:
 *   N  = total number of documents in the corpus
 *   df = number of documents that contain the word
 *
 * The "+1" smoothing prevents division-by-zero when a word appears in every
 * document (df === N would otherwise give ln(1) = 0), and also handles the
 * edge case where a word appears in zero documents (which shouldn't happen
 * here because vocabulary is built from the same documents, but is safe).
 */
export function computeIDF(documents: string[], vocabulary: string[]): number[] {
  const N = documents.length;

  // Count how many documents each vocabulary word appears in
  const docFrequencies = new Map<string, number>();
  for (const word of vocabulary) {
    docFrequencies.set(word, 0);
  }

  for (const doc of documents) {
    const wordsInDoc = new Set(tokenize(doc));
    for (const word of wordsInDoc) {
      docFrequencies.set(word, (docFrequencies.get(word) ?? 0) + 1);
    }
  }

  // Compute IDF for each word in vocabulary order
  return vocabulary.map((word) => {
    const df = docFrequencies.get(word) ?? 0;
    return Math.log((N + 1) / (df + 1)) + 1;
  });
}

/**
 * Computes full TF-IDF vectors for every document in the corpus.
 *
 * For each document:
 *   TF-IDF(word, doc) = TF(word, doc) × IDF(word)
 *
 * Returns:
 *   - vocabulary: the sorted array of unique words across all documents
 *   - vectors:    an array of TF-IDF vectors, one per input document,
 *                 each aligned to the vocabulary order
 */
export function computeTFIDF(documents: string[]): {
  vocabulary: string[];
  vectors: number[][];
} {
  // Step 1: Determine the shared vocabulary
  const vocabulary = buildVocabulary(documents);

  // Step 2: Compute IDF values from the whole corpus
  const idfValues = computeIDF(documents, vocabulary);

  // Step 3: For each document, compute TF and multiply by IDF
  const vectors: number[][] = documents.map((doc) => {
    const tfValues = computeTermFrequencies(doc, vocabulary);
    return tfValues.map((tf, i) => tf * idfValues[i]);
  });

  return { vocabulary, vectors };
}

/**
 * Vectorises a single text string against an **existing** vocabulary using the
 * corpus IDF weights.
 *
 * This is used when we have a user's preference text and need to produce a
 * vector that is directly comparable to the pre-computed product vectors.
 * The IDF values come from the product corpus (not the user's text), so the
 * vocabulary and weight scales remain the same.
 */
export function vectorizeAgainstVocabulary(
  text: string,
  vocabulary: string[],
  idfValues: number[],
): number[] {
  const tfValues = computeTermFrequencies(text, vocabulary);
  return tfValues.map((tf, i) => tf * idfValues[i]);
}
