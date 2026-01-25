import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Kuruluş AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial; padding: 20px">
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:10px 20px;
                  background:#000;color:#fff;text-decoration:none;
                  border-radius:6px">
          Reset Password
        </a>
        <p style="margin-top:20px;font-size:12px;color:#666">
          This link expires in 15 minutes.
        </p>
      </div>
    `,
  });
}
