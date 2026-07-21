import { connectToDatabase } from "@/libs/config/database.config";
import {
  ColourGroupName,
  PerceivedColourValueName,
  ProductTypeName,
  GraphicalAppearanceName,
  PerceivedColourMasterName,
} from "@/libs/enums/product.enums";
import Products from "@/libs/models/products.models";
import { pipeline, env, RawImage } from "@huggingface/transformers";
import { NextRequest, NextResponse } from "next/server";

type Classifier = ReturnType<typeof pipeline> | null;
type ZeroShotResult = { label: string; score: number }[];
const CONFIDENCE_THRESHOLD = 0.4;

let classifierPromise: Classifier = null;
env.localModelPath = "./models";
env.allowRemoteModels = false; // hard stop — never touches the network again

function getClassifier() {
  if (!classifierPromise) {
    classifierPromise = pipeline(
      "zero-shot-image-classification",
      "Xenova/clip-vit-base-patch32",
      { dtype: "q8" },
    );
  }
  return classifierPromise;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  console.log("FormData received:", formData);

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
    const arrayBuffer = await imageFile.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: imageFile.type });
    const image = await RawImage.fromBlob(blob);
    const clf = await getClassifier();

    const [productType, appearance, colourGroup, colourValue, colourMaster] =
      (await Promise.all([
        clf(image, ProductTypeName),
        clf(image, GraphicalAppearanceName),
        clf(image, ColourGroupName),
        clf(image, PerceivedColourValueName),
        clf(image, PerceivedColourMasterName),
      ])) as ZeroShotResult[];

    const productTypeValue = productType[0].label;
    const appearanceValue = appearance[0].label;
    const colourGroupValue = colourGroup[0].label;
    const colourValueValue = colourValue[0].label;
    const colourMasterValue = colourMaster[0].label;

    if (CONFIDENCE_THRESHOLD > productType[0].score) {
      return NextResponse.json(
        {
          error: " Unable to classify the image with sufficient confidence.",
        },
        {
          status: 400,
        },
      );
    }

    await connectToDatabase();

    const similarProducts = await Products.aggregate([
      {
        $match: {
          product_type_name: productTypeValue, // hard filter: must be the same type of item
        },
      },
      {
        $addFields: {
          matchScore: {
            $sum: [
              {
                $cond: [
                  { $eq: ["$graphical_appearance_name", appearanceValue] },
                  1,
                  0,
                ],
              },
              {
                $cond: [
                  { $eq: ["$colour_group_name", colourGroupValue] },
                  1,
                  0,
                ],
              },
              {
                $cond: [
                  { $eq: ["$perceived_colour_value_name", colourValueValue] },
                  1,
                  0,
                ],
              },
              {
                $cond: [
                  { $eq: ["$perceived_colour_master_name", colourMasterValue] },
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

    return NextResponse.json({
      message: "FormData received successfully",
      similarProducts,
      classifiedAttributes: {
        product_type_name: productTypeValue,
        graphical_appearance_name: appearanceValue,
        colour_group_name: colourGroupValue,
        perceived_colour_value_name: colourValueValue,
        perceived_colour_master_name: colourMasterValue,
      },
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
}
