import { auth } from "@/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

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
