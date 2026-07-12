import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/config/database.config";
import Products from "@/libs/models/products.models";

export async function GET(req: NextRequest) {
  const limit = parseInt(req?.nextUrl?.searchParams.get("limit") || "0") || 0;

  try {
    await connectToDatabase();
    const product = await Products.find()
      .limit(limit || 0)
      .lean();

    return NextResponse.json({
      message: "Successfully fetch all products",
      product,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Unable to fetch products",
      },
      {
        status: 500,
      },
    );
  }
}
