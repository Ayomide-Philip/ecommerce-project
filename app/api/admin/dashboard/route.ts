import { auth } from "@/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/libs/models/users.models";
import { connectToDatabase } from "@/libs/config/database.config";

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
    const user = await User.findById(
      new mongoose.Types.ObjectId(userId),
    ).select("role");

    if (user?.role !== "admin") {
    }
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
