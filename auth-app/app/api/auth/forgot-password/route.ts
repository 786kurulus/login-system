import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { transporter } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Kuruluş AI" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your password",
      html: `
        <div style="font-family:Arial">
          <h2>Password Reset</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link expires in 15 minutes.</p>
        </div>
      `,
    });

    console.log("✅ Reset email sent to:", user.email);

    return NextResponse.json({ message: "Email sent" });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
