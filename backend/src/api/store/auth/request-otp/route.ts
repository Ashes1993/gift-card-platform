import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple In-Memory Store for OTPs (Clears on restart)
// Structure: { "email@test.com": { code: "123456", expires: 1234567890 } }
if (!global.otpStore) global.otpStore = {};

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = req.body as any;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // 1. Generate 6-digit Code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Store it (Valid for 5 minutes)
  global.otpStore[email] = {
    code: otp,
    expires: Date.now() + 5 * 60 * 1000,
  };

  console.log(`[Auth] 🔐 Generated OTP for ${email}: ${otp}`);

  try {
    // 3. Send Email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: "ashkaneslamii1993@gmail.com", // Dev Mode: Use your verified email (Change the value to email)
      subject: "Verify your email",
      html: `
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h2>Verify your email</h2>
          <p>Your verification code is:</p>
          <div style="background: #f4f4f5; padding: 15px; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 12px;">This code expires in 5 minutes.</p>
        </div>
      `,
    });

    return res.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("[Auth] 💥 Email Error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
}
