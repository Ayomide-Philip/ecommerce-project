import { NextResponse } from "next/server";
import { getRecommendations } from "@/libs/recommendation/engine";
import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import mongoose from "mongoose";

export const GET = auth(async function GET(req: NextAuthRequest) {
  try {
    if (!req?.auth || !req?.auth?.user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized Access, please log in to view your recommendations.",
        },
        {
          status: 401,
        },
      );
    }
    const userId = req?.auth?.user?.id;

    if (!userId?.trim() || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          error: "Invalid Parameters.",
        },
        { status: 400 },
      );
    }

    const topNParam = req.nextUrl.searchParams.get("topN");
    const topN = topNParam
      ? Math.min(Math.max(parseInt(topNParam, 10) || 8, 1), 20)
      : 20;

    const recommendations = await getRecommendations(userId, topN);

    return NextResponse.json({ recommendations });
  } catch (err) {
    console.error("Recommendation error:", err);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 },
    );
  }
});
