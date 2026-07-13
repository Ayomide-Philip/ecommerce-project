import { NextResponse } from "next/server";
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
import User from "@/libs/models/users.models";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import {
  NEXT_PUBLIC_CLOUDINARY_API_KEY,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET,
} from "@/libs/config/config";

cloudinary.config({
  cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

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

  const userId = req?.auth?.user?.id;

  if (!userId?.trim() || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json(
      {
        error: "Invalid Parameters",
      },
      {
        status: 400,
      },
    );
  }
  const raw: Product = await req.json();

  // Normalize enum values to match the correct casing
  const matchEnum = <T extends readonly string[]>(arr: T, val: string) =>
    arr.find((e) => e.toLowerCase() === val.toLowerCase().trim()) || val;

  const product_type_name = matchEnum(ProductTypeName, raw.product_type_name);
  const graphical_appearance_name = matchEnum(
    GraphicalAppearanceName,
    raw.graphical_appearance_name,
  );
  const colour_group_name = matchEnum(ColourGroupName, raw.colour_group_name);
  const perceived_colour_value_name = matchEnum(
    PerceivedColourValueName,
    raw.perceived_colour_value_name,
  );
  const perceived_colour_master_name = matchEnum(
    PerceivedColourMasterName,
    raw.perceived_colour_master_name,
  );
  const department_name = matchEnum(DepartmentName, raw.department_name);
  const index_name = matchEnum(IndexName, raw.index_name);
  const { prod_name, detail_desc, price, article_id } = raw;

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
    !price ||
    !article_id?.trim()
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

  if (
    typeof price !== "number" ||
    Number(price) < 1 ||
    Number(price) > 100000
  ) {
    return NextResponse.json(
      {
        error: "Price must be a number between 1 and 100,000",
      },
      {
        status: 400,
      },
    );
  }

  if (article_id.trim().length < 3 || article_id.trim().length > 50) {
    return NextResponse.json(
      {
        error: "Image ID must be between 3 and 50 characters",
      },
      {
        status: 400,
      },
    );
  }

  try {
    await connectToDatabase();
    const user = await User.findById(new mongoose.Types.ObjectId(userId))
      .select("role")
      .lean();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        {
          error: "Only admins can add new products",
        },
        {
          status: 403,
        },
      );
    }

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
      article_id,
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

export const DELETE = auth(async function DELETE(req) {
  // if (!req?.auth || !req?.auth?.user) {
  //   return NextResponse.json(
  //     {
  //       error: "Unauthorized Access",
  //     },
  //     {
  //       status: 401,
  //     },
  //   );
  // }

  const searchParams = new URL(req.url).searchParams;
  const productId = searchParams.get("productId");
  const userId = searchParams.get("userId");

  if (
    !productId?.trim() ||
    !mongoose.Types.ObjectId.isValid(productId?.trim() || "")
  ) {
    return NextResponse.json(
      {
        error: "Invalid Parameters",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !userId?.trim() ||
    !mongoose.Types.ObjectId.isValid(userId?.trim() || "")
  ) {
    return NextResponse.json(
      {
        error: "Invalid Parameters",
      },
      {
        status: 400,
      },
    );
  }

  try {
    await connectToDatabase();

    const user = await User.findById(
      new mongoose.Types.ObjectId(userId?.trim() || ""),
    )
      .select("role")
      .lean();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        {
          error: "Only admins can delete products",
        },
        {
          status: 403,
        },
      );
    }

    const product = await Products.findById(
      new mongoose.Types.ObjectId(productId?.trim() || ""),
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

    if (product.article_id?.trim()) {
      const deleteImage = await cloudinary.uploader.destroy(
        `${product.article_id?.trim()}`,
        {
          invalidate: true,
        },
      );

      console.log("Cloudinary delete result:", deleteImage);

      if (deleteImage.result !== "ok" && deleteImage.result === "not found") {
        return NextResponse.json(
          {
            error: "Failed to delete the product image from Cloudinary",
          },
          {
            status: 500,
          },
        );
      }
    }

    const deletedProduct = await Products.deleteOne({
      _id: new mongoose.Types.ObjectId(productId?.trim() || ""),
    });

    if (deletedProduct.deletedCount === 0) {
      return NextResponse.json(
        {
          error: "Failed to delete the product",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Product deleted successfully",
        deleted: !!deletedProduct.deletedCount,
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    console.log(err);
    if (err.code === "EAI_AGAIN" || err.syscall === "getaddrinfo") {
      return Response.json(
        {
          error:
            "Cloudinary media server unreachable. Please check your internet connection and try again.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to delete the product",
      },
      {
        status: 500,
      },
    );
  }
});
