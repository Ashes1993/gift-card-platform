import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 🛠️ OTP Store Interface
interface OtpRecord {
  code: string;
  expiresAt: number; // When the code becomes invalid
  lastRequestedAt: number; // For rate limiting resends
}

// Initialize Global Store
// Note: In a production cluster (multiple servers), use Redis instead of global.
if (!(global as any).otpStore) {
  (global as any).otpStore = {} as Record<string, OtpRecord>;
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const store = (global as any).otpStore as Record<string, OtpRecord>;
  const now = Date.now();
  const ONE_MINUTE = 60 * 1000;

  // 1. Rate Limiting Check (Prevent spamming resend)
  const existingRecord = store[email];

  if (existingRecord) {
    const timeSinceLastRequest = now - existingRecord.lastRequestedAt;

    // If less than 60 seconds have passed since the last request
    if (timeSinceLastRequest < ONE_MINUTE) {
      const remainingSeconds = Math.ceil(
        (ONE_MINUTE - timeSinceLastRequest) / 1000,
      );
      return res.status(429).json({
        message: `Please wait ${remainingSeconds} seconds before requesting a new code.`,
        retryAfter: remainingSeconds,
      });
    }
  }

  // 2. Generate 6-digit Code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + ONE_MINUTE;

  // 3. Store/Update Record
  store[email] = {
    code: otp,
    expiresAt: expiresAt,
    lastRequestedAt: now,
  };

  console.log(`[Auth] 🔐 Generated OTP for ${email}: ${otp} (Expires in 60s)`);

  try {
    // 4. Send Email
    // In Dev Mode, Resend only emails the verified account owner.
    // For Production, ensure you have verified the domain.
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: "ashkaneslamii1993@gmail.com", // ⚠️ DEV MODE: Fixed email. In Prod use: email
      subject: "کد تایید ایمیل", // Persian Subject
      html: `
        <div style="font-family: Tahoma, Arial, sans-serif; padding: 20px; text-align: center; direction: rtl;">
          <h2>تایید آدرس ایمیل</h2>
          <p>کد تایید شما:</p>
          <div style="background: #f4f4f5; padding: 15px; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0; font-family: monospace;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 12px;">این کد تا ۱ دقیقه معتبر است.</p>
        </div>
      `,
    });

    // 5. Return Expiry Time for Frontend Timer
    return res.json({
      success: true,
      message: "OTP sent",
      expiresAt: expiresAt, // Frontend uses this to start the countdown
    });
  } catch (error) {
    console.error("[Auth] 💥 Email Error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
}
