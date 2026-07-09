import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json(
      {
        error: "Invalid parameters",
      },
      {
        status: 400,
      },
    );
  }

  try {
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Failed to fetch category",
      },
      {
        status: 500,
      },
    );
  }
}
