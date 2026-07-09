import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/config/database.config";
import Products from "@/libs/models/products.models";

export async function GET(req: NextRequest) {
  const limit = Math.min(
    parseInt(req?.nextUrl?.searchParams.get("limit") || "8") || 8,
    20,
  );

  try {
    await connectToDatabase();

    // Get a random selection of products using MongoDB's $sample aggregation
    const recommended = await Products.aggregate([
      { $sample: { size: limit } },
    ]);

    return NextResponse.json({
      message: "Recommendations fetched successfully",
      recommended,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Unable to fetch recommendations" },
      { status: 500 },
    );
  }
}
