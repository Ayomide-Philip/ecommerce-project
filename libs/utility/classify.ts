/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CLIPTextModelWithProjection,
  CLIPVisionModelWithProjection,
  AutoProcessor,
  AutoTokenizer,
  RawImage,
} from "@huggingface/transformers";

const MODEL_ID = "Xenova/clip-vit-base-patch32";

let modelPromise: Promise<{
  visionModel: any;
  textModel: any;
  processor: any;
  tokenizer: any;
}> | null = null;

function getModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      const [visionModel, textModel, processor, tokenizer] = await Promise.all([
        CLIPVisionModelWithProjection.from_pretrained(MODEL_ID, {
          dtype: "q8",
        }),
        CLIPTextModelWithProjection.from_pretrained(MODEL_ID, { dtype: "q8" }),
        AutoProcessor.from_pretrained(MODEL_ID),
        AutoTokenizer.from_pretrained(MODEL_ID),
      ]);
      return { visionModel, textModel, processor, tokenizer };
    })();
  }
  return modelPromise;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function softmax(scores: number[]): number[] {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp((s - max) * 100));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export async function classifyAgainstGroups(
  image: RawImage,
  labelGroups: Record<string, string[]>,
): Promise<Record<string, { label: string; score: number }[]>> {
  const { visionModel, textModel, processor, tokenizer } = await getModel();

  const imageInputs = await processor(image);
  const { image_embeds } = await visionModel(imageInputs);
  const imageEmbedding = Array.from(image_embeds.data as Float32Array);
  const dim = imageEmbedding.length;

  const results: Record<string, { label: string; score: number }[]> = {};

  for (const [groupName, labels] of Object.entries(labelGroups)) {
    const textInputs = tokenizer(labels, { padding: true, truncation: true });
    const { text_embeds } = await textModel(textInputs);

    const flatData = Array.from(text_embeds.data as Float32Array);
    const textEmbeddings: number[][] = [];
    for (let i = 0; i < labels.length; i++) {
      textEmbeddings.push(flatData.slice(i * dim, (i + 1) * dim));
    }

    const rawScores = textEmbeddings.map((te) =>
      cosineSimilarity(imageEmbedding, te),
    );
    const scores = softmax(rawScores);

    results[groupName] = labels
      .map((label, i) => ({ label, score: scores[i] }))
      .sort((a, b) => b.score - a.score);
  }

  return results;
}
