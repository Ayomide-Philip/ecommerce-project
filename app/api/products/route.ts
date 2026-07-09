import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/config/database.config";
import Products, { Product } from "@/libs/models/products.models";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const limit = parseInt(req?.nextUrl?.searchParams.get("limit") || "0") || 0;

  try {
    await connectToDatabase();
    const product = await Products.find()
      .limit(limit || 0)
      .lean();

    return NextResponse.json({
      message: "Successfully fetch all products",
      limit,
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

export const POST = auth(async function POST(req: NextRequest) {
  const {
    prod_name,
    product_type_name,
    graphical_appearance_name,
    colour_group_name,
    perceived_colour_value_name,
    perceived_colour_master_name,
    department_name,
    index_name,
    detail_desc,
    price,
  }: Product = await req.json();

  if (
    !prod_name?.trim() ||
    !product_type_name?.trim() ||
    !graphical_appearance_name?.trim() ||
    !colour_group_name?.trim() ||
    !perceived_colour_value_name?.trim() ||
    !perceived_colour_master_name?.trim() ||
    !department_name?.trim() ||
    !index_name?.trim() ||
    !detail_desc?.trim() ||
    !price
  ) {
    return NextResponse.json(
      {
        error: "All fields are required",
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json(
    {
      message: "Added a new product",
    },
    {
      status: 200,
    },
  );
});
