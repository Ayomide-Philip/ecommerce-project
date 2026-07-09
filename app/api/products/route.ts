import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/config/database.config";
import Products, { Product } from "@/libs/models/products.models";
import { auth } from "@/auth";
import {
  ColourGroupName,
  DepartmentName,
  GraphicalAppearanceName,
  IndexName,
  PerceivedColourMasterName,
  PerceivedColourValueName,
  ProductTypeName,
} from "@/libs/enums/product.enums";

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

export const POST = auth(async function POST(req) {
  if (!req?.auth || !req?.auth?.user) {
    return NextResponse.json(
      {
        error: "You are not authenticated",
      },
      {
        status: 401,
      },
    );
  }

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

  if (prod_name?.trim()?.length < 5 || prod_name?.trim()?.length > 100) {
    return NextResponse.json(
      {
        error: "Product name must be between 5 and 100 characters",
      },
      {
        status: 400,
      },
    );
  }

  if (
    product_type_name?.trim()?.length < 3 ||
    product_type_name?.trim()?.length > 50 ||
    !(ProductTypeName as readonly string[])?.includes(product_type_name?.trim())
  ) {
    return NextResponse.json(
      {
        error:
          "Product type name must be between 3 and 50 characters and must be a valid product type",
      },
      {
        status: 400,
      },
    );
  }

  if (
    graphical_appearance_name?.trim()?.length < 3 ||
    graphical_appearance_name?.trim()?.length > 50 ||
    !(GraphicalAppearanceName as readonly string[])?.includes(
      graphical_appearance_name?.trim(),
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Graphical appearance name must be between 3 and 50 characters and must be a valid graphical appearance",
      },
      {
        status: 400,
      },
    );
  }

  if (
    colour_group_name?.trim()?.length < 3 ||
    colour_group_name?.trim()?.length > 50 ||
    !(ColourGroupName as readonly string[])?.includes(colour_group_name?.trim())
  ) {
    return NextResponse.json(
      {
        error:
          "Colour group name must be between 3 and 50 characters and must be a valid colour group",
      },
      {
        status: 400,
      },
    );
  }

  if (
    perceived_colour_value_name?.trim()?.length < 3 ||
    perceived_colour_value_name?.trim()?.length > 50 ||
    !(PerceivedColourValueName as readonly string[])?.includes(
      perceived_colour_value_name?.trim(),
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Perceived colour value name must be between 3 and 50 characters and must be a valid perceived colour value",
      },
      {
        status: 400,
      },
    );
  }

  if (
    perceived_colour_master_name?.trim()?.length < 3 ||
    perceived_colour_master_name?.trim()?.length > 50 ||
    !(PerceivedColourMasterName as readonly string[])?.includes(
      perceived_colour_master_name?.trim(),
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Perceived colour master name must be between 3 and 50 characters and must be a valid perceived colour master",
      },
      {
        status: 400,
      },
    );
  }

  if (
    department_name?.trim()?.length < 3 ||
    department_name?.trim()?.length > 50 ||
    !(DepartmentName as readonly string[])?.includes(department_name?.trim())
  ) {
    return NextResponse.json(
      {
        error:
          "Department name must be between 3 and 50 characters and must be a valid department",
      },
      {
        status: 400,
      },
    );
  }

  if (
    index_name?.trim()?.length < 3 ||
    index_name?.trim()?.length > 50 ||
    !(IndexName as readonly string[])?.includes(index_name?.trim())
  ) {
    return NextResponse.json(
      {
        error:
          "Index name must be between 3 and 50 characters and must be a valid index",
      },
      {
        status: 400,
      },
    );
  }

  if (detail_desc?.trim()?.length < 10 || detail_desc?.trim()?.length > 1000) {
    return NextResponse.json(
      {
        error: "Detail description must be between 10 and 1000 characters",
      },
      {
        status: 400,
      },
    );
  }

  if (typeof price !== "number" || price < 1 || price > 100000) {
    return NextResponse.json(
      {
        error: "Price must be a number between 1 and 100,000",
      },
      {
        status: 400,
      },
    );
  }

  try {
    await connectToDatabase();
    const existingProduct = await Products.findOne({
      prod_name: prod_name?.trim(),
      detail_desc: detail_desc?.trim(),
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          error: "A product with the same name and description already exists",
        },
        {
          status: 400,
        },
      );
    }
    const newProduct = await Products.create({
      prod_name: prod_name?.trim(),
      product_type_name: product_type_name?.trim(),
      graphical_appearance_name: graphical_appearance_name?.trim(),
      colour_group_name: colour_group_name?.trim(),
      perceived_colour_value_name: perceived_colour_value_name?.trim(),
      perceived_colour_master_name: perceived_colour_master_name?.trim(),
      department_name: department_name?.trim(),
      index_name: index_name?.trim(),
      detail_desc: detail_desc?.trim(),
      price,
    });
    return NextResponse.json(
      {
        message: "Added a new product",
        product: !!newProduct,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Unable to add a new product",
      },
      {
        status: 500,
      },
    );
  }
});
