import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";
import mongoose from "mongoose";
import User from "@/libs/models/users.models";
import { connectToDatabase } from "@/libs/config/database.config";

// Configure the backend Cloudinary SDK with your secret credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = auth(async function POST(request) {
  if (!request?.auth || !request?.auth?.user) {
    return NextResponse.json(
      {
        error: "Unauthorized Access",
      },
      {
        status: 401,
      },
    );
  }

  const userId = request.auth.user.id;

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

    const user = await User.findById(
      new mongoose.Types.ObjectId(userId),
    ).select("role");

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        {
          error: "Unauthorized Access",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();
    const { paramsToSign } = body;

    // Generate a secure cryptographic signature using your server-side API Secret
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!,
    );

    return NextResponse.json({ signature });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 },
    );
  }
});
