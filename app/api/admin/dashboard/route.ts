import { auth } from "@/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/libs/models/users.models";
import { connectToDatabase } from "@/libs/config/database.config";
import Products from "@/libs/models/products.models";
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

  if (
    !userId?.trim() ||
    !mongoose.Types.ObjectId.isValid(userId?.trim() || "")
  ) {
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
    const user = await User.findById(new mongoose.Types.ObjectId(userId))
      .select("role")
      .lean();

    if (!user || user?.role !== "admin") {
      return NextResponse.json(
        {
          error: "Only admin can view this api",
        },
        {
          status: 401,
        },
      );
    }

    const allProducts = await Products.find().lean();

    const allOrders = await Orders.find().select("totalAmount").lean();

    const allUsers = await User.find().lean();

    const totalRevenues: number = allOrders.reduce((sum, acc) => {
      return sum + acc?.totalAmount;
    }, 0);

    console.log(totalRevenues);

    return NextResponse.json(
      {
        message: "Fetch admin stats",
        stats: {
          totalProduct: allProducts?.length || 0,
          totalOrder: allOrders?.length || 0,
          totalUsers: allUsers?.length || 0,
          totalRevenue: Number(totalRevenues.toFixed(2)) || 0,
        },
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Failed to fetch data. Please try again later.",
      },
      {
        status: 500,
      },
    );
  }
});
