import { auth } from "@/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/libs/config/database.config";
import User from "@/libs/models/users.models";
import Orders from "@/libs/models/order.models";

export const GET = auth(async function GET(req) {
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
  const limit = parseInt(req?.nextUrl?.searchParams.get("limit") || "0") || 0;

  if (!mongoose.Types.ObjectId.isValid(userId?.trim() || "")) {
    return NextResponse.json(
      {
        error: "Unauthorized Access",
      },
      {
        status: 401,
      },
    );
  }

  try {
    await connectToDatabase();

    const user = await User.findById(
      new mongoose.Types.ObjectId(userId?.trim()),
    )
      .select("role")
      .lean();

    if (user?.role !== "admin") {
      return NextResponse.json(
        {
          error: "Unauthorized Access",
        },
        {
          status: 401,
        },
      );
    }

    const orders = await Orders.find()
      .populate("userId", "name email")
      .populate("items.productId", "prod_name price")
      .limit(limit || 0)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
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
        error: "Unable to fetch orders",
      },
      {
        status: 500,
      },
    );
  }
});
