import { auth } from "@/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/libs/config/database.config";
import User from "@/libs/models/users.models";

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

  const userId = req.auth.user.id;

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

    const users = await User.findById(
      new mongoose.Types.ObjectId(userId?.trim()),
    ).lean();

    if (!users) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    if (users.role !== "admin") {
      return NextResponse.json(
        {
          error: "Unauthorized Access",
        },
        {
          status: 403,
        },
      );
    }

    const usersList = await User.find().lean();

    return NextResponse.json(
      {
        users: usersList,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Unable to fetch user data. Please try again later.",
      },
      {
        status: 500,
      },
    );
  }
});
