import { connectToDatabase } from "@/libs/config/database.config";
import User from "@/libs/models/users.models";
import { NextRequest, NextResponse } from "next/server";

export const POST = async function POST(req: NextRequest) {
  const { name, password, email } = await req.json();

  if (!name?.trim() || !password?.trim() || !email?.trim()) {
    return NextResponse.json(
      {
        error: "All fields are required",
      },
      {
        status: 400,
      },
    );
  }

  if (name?.trim()?.length < 5) {
    return NextResponse.json(
      {
        error: "Name must be at least 5 characters long",
      },
      {
        status: 400,
      },
    );
  }

  if (!name?.trim()?.includes(" ")) {
    return NextResponse.json(
      {
        error: "Name must contain a space",
      },
      {
        status: 400,
      },
    );
  }

  if (email.trim().length < 5) {
    return NextResponse.json(
      {
        error: "Email must be at least 5 characters long",
      },
      {
        status: 400,
      },
    );
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email?.trim())) {
    return NextResponse.json(
      {
        error: "Please enter a valid email address",
      },
      {
        status: 400,
      },
    );
  }

  if (password?.trim()?.length < 8) {
    return NextResponse.json(
      {
        error: "Password must be at least 8 characters long",
      },
      {
        status: 400,
      },
    );
  }

  try {
    await connectToDatabase();
    const userExist = await User.exists({
      email: email?.trim()?.toLowerCase(),
    });

    if (userExist) {
      return NextResponse.json(
        {
          error: "User with this email already exists",
        },
        {
          status: 400,
        },
      );
    }
    
    return NextResponse.json({ message: "Hello from the POST handler!" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: " An error occurred while processing your request.",
      },
      {
        status: 500,
      },
    );
  }
};
