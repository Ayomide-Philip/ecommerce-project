import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/libs/config/database.config";
import Orders from "@/libs/models/order.models";

export const GET = auth(async function GET(req: NextAuthRequest) {
  if (!req?.auth || !req?.auth?.user) {
    return NextResponse.json(
      {
        error: "Unauthorized Access, please log in to view your orders.",
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

    const orders = await Orders.find({
      userId: new mongoose.Types.ObjectId(userId?.trim()),
    })
      .populate("items.productId", "prod_name product_type_name price")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: "Orders fetched successfully",
        orders,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Failed to fetch orders",
      },
      {
        status: 500,
      },
    );
  }
});
