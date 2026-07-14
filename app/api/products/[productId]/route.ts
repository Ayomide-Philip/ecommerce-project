import { connectToDatabase } from "@/libs/config/database.config";
import Products from "@/libs/models/products.models";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      {
        error: "Invalid parameters",
      },
      {
        status: 400,
      },
    );
  }
  try {
    await connectToDatabase();
    const product = await Products.findById(
      new mongoose.Types.ObjectId(productId),
    ).lean();

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        product,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Failed to fetch product",
      },
      {
        status: 500,
      },
    );
  }
}
