import { connectToDatabase } from "@/libs/config/database.config";
import Products from "@/libs/models/products.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!slug) {
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

    const formattedSlug = slug.replace(/-/g, " ");
    const searchTerm = formattedSlug.toLowerCase();

    const category = await Products.find({
      product_type_name: {
        $regex: new RegExp(
          `^${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          "i",
        ),
      },
    }).lean();

    if (!category || category.length === 0) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        {
          status: 404,
        },
      );
    }
    return NextResponse.json(
      {
        category,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Failed to fetch category",
      },
      {
        status: 500,
      },
    );
  }
}
