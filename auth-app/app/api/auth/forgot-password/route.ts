import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 🔢 Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetCode = code;
    user.resetCodeExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    await sendEmail({
      to: email,
      subject: "Your Kuruluş AI reset code",
      html: `
        <h2>Password Reset</h2>
        <p>Your verification code:</p>
        <h1>${code}</h1>
        <p>Expires in 15 minutes.</p>
      `,
    });

    return NextResponse.json({ message: "OTP sent" });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
