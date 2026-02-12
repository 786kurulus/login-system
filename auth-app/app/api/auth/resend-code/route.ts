import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  const { email } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // ⏳ Cooldown: 60 seconds
  if (user.resetCodeExpiry && user.resetCodeExpiry - Date.now() > 14 * 60 * 1000) {
    return NextResponse.json(
      { message: "Please wait before resending" },
      { status: 429 }
    );
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetCode = code;
  user.resetCodeExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  await sendEmail({
    to: email,
    subject: "Your new Kuruluş AI reset code",
    html: `<h1>${code}</h1><p>Expires in 15 minutes.</p>`,
  });

  return NextResponse.json({ message: "OTP resent" });
}
