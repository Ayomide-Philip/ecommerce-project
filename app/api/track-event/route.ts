import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Interactions, { EventType } from "@/libs/models/interaction.models";
import { connectToDatabase } from "@/libs/config/database.config";
import User from "@/libs/models/users.models";
import Products from "@/libs/models/products.models";

export const POST = auth(async function POST(req: NextAuthRequest) {
  const { userId, productId, eventType } = await req.json();

  if (!userId?.trim() || !productId?.trim() || !eventType.trim()) {
    return NextResponse.json(
      {
        error: "Invalid parameters",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(userId?.trim()) ||
    !mongoose.Types.ObjectId.isValid(productId?.trim())
  ) {
    return NextResponse.json(
      {
        error: "Invalid parameters",
      },
      {
        status: 400,
      },
    );
  }

  if (!Object.values(EventType).includes(eventType?.trim())) {
    return NextResponse.json(
      {
        error: "Invalid event type",
      },
      {
        status: 400,
      },
    );
  }

  try {
    await connectToDatabase();
    const userExist = await User.findById(
      new mongoose.Types.ObjectId(userId?.trim()),
    )
      .select("_id")
      .lean();

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

    const productExist = await Products.findById(
      new mongoose.Types.ObjectId(productId?.trim()),
    )
      .select("_id")
      .lean();

    if (!productExist) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    const newInteraction = await Interactions.create({
      userId: new mongoose.Types.ObjectId(userId?.trim()),
      productId: new mongoose.Types.ObjectId(productId?.trim()),
      eventType: eventType?.trim(),
    });

    if (!newInteraction) {
      return NextResponse.json(
        {
          error: "Failed to track event",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Event tracked successfully",
        interaction: !!newInteraction,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Failed to track event",
      },
      {
        status: 500,
      },
    );
  }
});
