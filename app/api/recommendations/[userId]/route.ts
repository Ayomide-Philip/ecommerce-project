/**
 * GET /api/recommendations/[userId]
 *
 * Returns personalised product recommendations for the specified user.
 * Uses the content-based recommendation engine (TF-IDF + cosine similarity).
 *
 * If the user has no interaction history, falls back to popularity-based
 * recommendations (most interacted-with products across all users).
 *
 * @param userId - MongoDB ObjectId of the target user (URL parameter).
 * @query  topN  - Optional query parameter to control how many products are
 *                 returned (default 8).
 *
 * Responses:
 *   200 - { recommendations: Product[] }
 *   400 - { error: "User ID is required" }
 *   500 - { error: "Failed to generate recommendations" }
 */

import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/libs/recommendation/engine";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    // Validate that a userId was provided
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Parse optional topN query parameter (default 8, max 20)
    const topNParam = req.nextUrl.searchParams.get("topN");
    const topN = topNParam
      ? Math.min(Math.max(parseInt(topNParam, 10) || 8, 1), 20)
      : 8;

    // Generate recommendations using the engine
    const recommendations = await getRecommendations(userId, topN);

    return NextResponse.json({ recommendations });
  } catch (err) {
    console.error("Recommendation error:", err);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 },
    );
  }
}
