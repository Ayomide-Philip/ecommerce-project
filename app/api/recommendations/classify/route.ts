import { auth } from "@/auth";
import { connectToDatabase } from "@/libs/config/database.config";
import {
  ColourGroupName,
  PerceivedColourValueName,
  ProductTypeName,
  GraphicalAppearanceName,
  PerceivedColourMasterName,
} from "@/libs/enums/product.enums";
import Products from "@/libs/models/products.models";
import {
  pipeline,
  env,
  RawImage,
  ZeroShotImageClassificationPipeline,
} from "@huggingface/transformers";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

type ZeroShotResult = { label: string; score: number }[];
const CONFIDENCE_THRESHOLD = 0.15;

// Use globalThis for model caching — survives hot reloads & edge cold-starts better
env.localModelPath = "./models";
env.allowRemoteModels = false;

declare global {
  var __classifierPromise:
    | Promise<ZeroShotImageClassificationPipeline>
    | undefined;
}

function getClassifier(): Promise<ZeroShotImageClassificationPipeline> {
  if (!globalThis.__classifierPromise) {
    globalThis.__classifierPromise = pipeline(
      "zero-shot-image-classification",
      "Xenova/clip-vit-base-patch32",
      { dtype: "q8" },
    ) as unknown as Promise<ZeroShotImageClassificationPipeline>;
  }
  return globalThis.__classifierPromise;
}

/**
 * Classify the image across 3 focused model calls instead of 1 giant call with 96 labels.
 *
 * Why this matters: CLIP normalises scores across the labels it's given. When we throw
 * all 96 labels from 5 categories together, the model spreads probability across
 * unrelated options (e.g. comparing "Trousers" vs "Beige" vs "Denim"). This artificially
 * suppresses per-category scores.
 *
 * By splitting into semantically-related groups, each call has fewer, more relevant
 * labels — so confidence scores are higher and more meaningful.
 *
 * Performance: 3 model passes instead of 5 (original), each image-encodes once per pass.
 */
async function classifyImage(
  clf: ZeroShotImageClassificationPipeline,
  image: RawImage,
): Promise<{
  productType: { label: string; score: number };
  appearance: { label: string; score: number };
  colourGroup: { label: string; score: number };
  colourValue: { label: string; score: number };
  colourMaster: { label: string; score: number };
}> {
  // Run 3 focused calls in parallel
  const [[productType], [appearance], colourResults] = (await Promise.all([
    clf(image, [...ProductTypeName]),
    clf(image, [...GraphicalAppearanceName]),
    clf(image, [
      ...ColourGroupName,
      ...PerceivedColourValueName,
      ...PerceivedColourMasterName,
    ]),
  ])) as unknown as [ZeroShotResult, ZeroShotResult, ZeroShotResult];

  // Colour set includes labels from 3 enums — pick the best in each
  const colourSets: Record<string, Set<string>> = {
    colourGroup: new Set(ColourGroupName),
    colourValue: new Set(PerceivedColourValueName),
    colourMaster: new Set(PerceivedColourMasterName),
  };

  const groupedColours: Record<string, { label: string; score: number }> = {};
  for (const r of colourResults) {
    for (const [key, set] of Object.entries(colourSets)) {
      if (set.has(r.label) && !groupedColours[key]) {
        groupedColours[key] = { label: r.label, score: r.score };
        break;
      }
    }
  }

  return {
    productType,
    appearance,
    colourGroup: groupedColours.colourGroup!,
    colourValue: groupedColours.colourValue!,
    colourMaster: groupedColours.colourMaster!,
  };
}

export const POST = auth(async function POST(req) {
  if (!req?.auth || !req?.auth?.user) {
    return NextResponse.json(
      {
        error: "Unauthorized Access, please log in to classify an image.",
      },
      {
        status: 401,
      },
    );
  }

  const userId = req?.auth?.user?.id;

  if (!userId?.trim() || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json(
      {
        error: "Invalid Parameters.",
      },
      {
        status: 400,
      },
    );
  }
  const formData = await req.formData();
  const imageFile = formData.get("image") as File | null;

  if (!imageFile) {
    return NextResponse.json(
      {
        error: "No image file provided.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    await connectToDatabase();

    const arrayBuffer = await imageFile.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: imageFile.type });
    const image = await RawImage.fromBlob(blob);
    const clf = await getClassifier();

    // Single model inference call instead of 5
    const { productType, appearance, colourGroup, colourValue, colourMaster } =
      await classifyImage(clf, image);

    console.log(
      productType,
      appearance,
      colourGroup,
      colourValue,
      colourMaster,
    );

    // Early exit — don't waste time on the DB query if confidence is too low
    if (CONFIDENCE_THRESHOLD > productType.score) {
      return NextResponse.json(
        {
          error: "Unable to classify the image with sufficient confidence.",
        },
        {
          status: 400,
        },
      );
    }

    // Primary aggregation — exact product_type match, scored by other attributes
    let similarProducts = await Products.aggregate([
      {
        $match: {
          product_type_name: productType.label,
        },
      },
      {
        $addFields: {
          matchScore: {
            $sum: [
              {
                $cond: [
                  { $eq: ["$graphical_appearance_name", appearance.label] },
                  1,
                  0,
                ],
              },
              {
                $cond: [
                  { $eq: ["$colour_group_name", colourGroup.label] },
                  1,
                  0,
                ],
              },
              {
                $cond: [
                  {
                    $eq: ["$perceived_colour_value_name", colourValue.label],
                  },
                  1,
                  0,
                ],
              },
              {
                $cond: [
                  {
                    $eq: ["$perceived_colour_master_name", colourMaster.label],
                  },
                  1,
                  0,
                ],
              },
            ],
          },
        },
      },
      { $sort: { matchScore: -1 } },
      { $limit: 10 },
    ]);

    // Fallback — if no exact product_type match, broaden the search
    if (similarProducts.length === 0) {
      similarProducts = await Products.aggregate([
        {
          $addFields: {
            matchScore: {
              $sum: [
                {
                  $cond: [
                    { $eq: ["$product_type_name", productType.label] },
                    3,
                    0,
                  ],
                },
                {
                  $cond: [
                    { $eq: ["$graphical_appearance_name", appearance.label] },
                    2,
                    0,
                  ],
                },
                {
                  $cond: [
                    { $eq: ["$colour_group_name", colourGroup.label] },
                    1,
                    0,
                  ],
                },
                {
                  $cond: [
                    {
                      $eq: ["$perceived_colour_value_name", colourValue.label],
                    },
                    1,
                    0,
                  ],
                },
                {
                  $cond: [
                    {
                      $eq: [
                        "$perceived_colour_master_name",
                        colourMaster.label,
                      ],
                    },
                    1,
                    0,
                  ],
                },
              ],
            },
          },
        },
        { $sort: { matchScore: -1 } },
        { $limit: 10 },
      ]);
    }

    return NextResponse.json({
      message:
        "Successfully classified the image and retrieved similar products.",
      similarProducts,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    if (err?.code == "EAI_AGAIN") {
      return NextResponse.json(
        {
          error:
            "Network error occurred while classifying the image. Please try again.",
        },
        {
          status: 503,
        },
      );
    }
    return NextResponse.json(
      {
        error: "Failed to classify the image.",
      },
      {
        status: 500,
      },
    );
  }
});
