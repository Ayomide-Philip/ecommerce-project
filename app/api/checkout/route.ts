import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/libs/config/database.config";
import Carts from "@/libs/models/cart.models";
import Orders from "@/libs/models/order.models";
import Interactions, { EventType } from "@/libs/models/interaction.models";
import User from "@/libs/models/users.models";

export const POST = auth(async function POST(req: NextAuthRequest) {
  if (!req?.auth || !req?.auth?.user) {
    return NextResponse.json(
      {
        error: "Unauthorized Access, please log in to checkout.",
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

    const cartItems = await Carts.find({
      userId: new mongoose.Types.ObjectId(userId?.trim()),
    })
      .populate("productId", "price")
      .lean();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        {
          error: "Your cart is empty. Add items before checkout.",
        },
        {
          status: 400,
        },
      );
    }

    const items = cartItems.map((item) => ({
      productId: item.productId as unknown as mongoose.Types.ObjectId,
      quantity: item.quantity,
      priceAtPurchase: (item.productId as unknown as { price: number }).price,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0,
    );

    const order = await Orders.create({
      userId: new mongoose.Types.ObjectId(userId?.trim()),
      items,
      totalAmount,
      status: "paid",
      paymentMethod: "dummy-card",
    });

    const interactionData = cartItems.map((item) => ({
      userId: new mongoose.Types.ObjectId(userId?.trim()),
      productId: item.productId as unknown as mongoose.Types.ObjectId,
      eventType: EventType.PURCHASE,
    }));

    await Interactions.insertMany(interactionData);

    await Carts.deleteMany({
      userId: new mongoose.Types.ObjectId(userId?.trim()),
    });

    return NextResponse.json(
      {
        message: "Order placed successfully!",
        order: !!order,
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Failed to process checkout. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
});
