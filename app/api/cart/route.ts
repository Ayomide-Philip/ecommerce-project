import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/libs/config/database.config";
import Carts, { Cart } from "@/libs/models/cart.models";
import Products from "@/libs/models/products.models";
import User from "@/libs/models/users.models";

export const GET = auth(async function GET(req: NextAuthRequest) {
  if (!req?.auth || !req?.auth?.user) {
    return NextResponse.json(
      {
        error: "Unauthorized Access",
      },
      {
        status: 401,
      },
    );
  }

  const userId = req?.auth?.user?.id;

  if (!mongoose.Types.ObjectId.isValid(userId?.trim() || "")) {
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
    const userCart = await Carts.find({ userId: userId?.trim() || "" })
      .populate("productId")
      .lean();

    return NextResponse.json(
      {
        message: "Cart fetched successfully",
        cart: userCart,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Failed to fetch cart",
      },
      {
        status: 500,
      },
    );
  }
});

export const POST = auth(async function POST(req: NextAuthRequest) {
  if (!req?.auth || !req?.auth?.user) {
    return NextResponse.json(
      {
        error: "Unauthorized Access",
      },
      {
        status: 401,
      },
    );
  }

  const userId = req?.auth?.user?.id;

  const { productId, quantity }: { productId: string; quantity: number } =
    await req.json();

  if (!productId?.trim() || !quantity || !userId?.trim()) {
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
    !mongoose.Types.ObjectId.isValid(productId?.trim() || "") ||
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

  if (quantity <= 0 || quantity > 100) {
    return NextResponse.json(
      {
        error: "Invalid quantity. Please enter a value between 1 and 100.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    await connectToDatabase();

    const userExist = await User.exists({
      _id: new mongoose.Types.ObjectId(userId?.trim()),
    });

    if (!userExist) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    const productExists = await Products.exists({
      _id: new mongoose.Types.ObjectId(productId?.trim()),
    });

    if (!productExists) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    const itemInCart = await Carts.findOne({
      productId: new mongoose.Types.ObjectId(productId?.trim()),
      userId: new mongoose.Types.ObjectId(userId?.trim()),
    });

    if (itemInCart) {
      return NextResponse.json(
        {
          error: "Product already in cart. Please update the quantity instead.",
        },
        {
          status: 400,
        },
      );
    }

    const newCartItem: Cart = await Carts.create({
      userId: new mongoose.Types.ObjectId(userId?.trim()),
      productId: new mongoose.Types.ObjectId(productId?.trim()),
      quantity,
    });

    return NextResponse.json({
      message: "Cart item added successfully",
      cartItem: !!newCartItem,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Failed to add product to cart",
      },
      {
        status: 500,
      },
    );
  }
});
