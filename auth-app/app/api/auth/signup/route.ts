import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "../../../../models/User";
import { connectDB } from "../../../../lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
  }
}
