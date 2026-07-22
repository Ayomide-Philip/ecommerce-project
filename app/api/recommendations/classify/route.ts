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

type Classifier = Promise<ZeroShotImageClassificationPipeline> | null;
type ZeroShotResult = { label: string; score: number }[];
const CONFIDENCE_THRESHOLD = 0.2;

let classifierPromise: Classifier = null;
env.localModelPath = "./models";
env.allowRemoteModels = false;

function getClassifier() {
  if (!classifierPromise) {
    classifierPromise = pipeline(
      "zero-shot-image-classification",
      "Xenova/clip-vit-base-patch32",
      { dtype: "q8" },
    ) as unknown as Promise<ZeroShotImageClassificationPipeline>;
  }
  return classifierPromise;
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

    const [productType, appearance, colourGroup, colourValue, colourMaster] =
      (await Promise.all([
        clf(image, [...ProductTypeName]),
        clf(image, [...GraphicalAppearanceName]),
        clf(image, [...ColourGroupName]),
        clf(image, [...PerceivedColourValueName]),
        clf(image, [...PerceivedColourMasterName]),
      ])) as unknown as ZeroShotResult[];

    console.log(
      productType,
      appearance,
      colourGroup,
      colourValue,
      colourMaster,
    );

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

    const similarProducts = await Products.aggregate([
      {
        $match: {
          product_type_name: productTypeValue,
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
