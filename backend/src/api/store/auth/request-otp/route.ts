import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 🛠️ OTP Store Interface
interface OtpRecord {
  code: string;
  expiresAt: number;
  lastRequestedAt: number;
}

// Initialize Global Store
if (!(global as any).otpStore) {
  (global as any).otpStore = {} as Record<string, OtpRecord>;
}

// Config Constants
const OTP_EXPIRY_MINUTES = 3; // Increased to 3 minutes to prevent "Expired" errors
const RATE_LIMIT_SECONDS = 60;

// Email Identity
const SENDER_EMAIL = "NextLicense <noreply@nextlicense.shop>";
const SUPPORT_EMAIL = "support@nextlicense.shop";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // 1. Normalize Email (Crucial for matching keys later)
  const normalizedEmail = email.toLowerCase().trim();

  const store = (global as any).otpStore as Record<string, OtpRecord>;
  const now = Date.now();

  // 2. Rate Limiting Check
  const existingRecord = store[normalizedEmail];

  if (existingRecord) {
    const timeSinceLastRequest = now - existingRecord.lastRequestedAt;
    const rateLimitMs = RATE_LIMIT_SECONDS * 1000;

    if (timeSinceLastRequest < rateLimitMs) {
      const remainingSeconds = Math.ceil(
        (rateLimitMs - timeSinceLastRequest) / 1000,
      );
      return res.status(429).json({
        message: `لطفاً ${remainingSeconds} ثانیه صبر کنید.`, // Persian Error
        retryAfter: remainingSeconds,
      });
    }
  }

  // 3. Generate 6-digit Code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + OTP_EXPIRY_MINUTES * 60 * 1000;

  // 4. Store Record (Using Normalized Email)
  store[normalizedEmail] = {
    code: otp,
    expiresAt: expiresAt,
    lastRequestedAt: now,
  };

  console.log(
    `[Auth] 🔐 Generated OTP for ${normalizedEmail}: ${otp} (Expires in ${OTP_EXPIRY_MINUTES}m)`,
  );

  try {
    // 5. Send Email
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [normalizedEmail], // FIXED: Sends to the user, not dev email
      replyTo: SUPPORT_EMAIL,
      subject: "کد تایید ورود | نکست لایسنس",
      html: `
        <div style="font-family: Tahoma, Arial, sans-serif; padding: 20px; text-align: center; direction: rtl; color: #333;">
          <h2 style="color: #2563eb;">کد تایید شما</h2>
          <p style="font-size: 14px; color: #555;">برای ورود یا ثبت‌نام در نکست لایسنس، از کد زیر استفاده کنید:</p>
          
          <div style="background: #f3f4f6; border: 1px solid #e5e7eb; padding: 15px; border-radius: 12px; font-size: 28px; letter-spacing: 8px; font-weight: bold; margin: 25px 0; font-family: monospace; color: #111;">
            ${otp}
          </div>
          
          <p style="color: #6b7280; font-size: 12px;">این کد تا ${OTP_EXPIRY_MINUTES} دقیقه معتبر است.</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 10px;">اگر شما این درخواست را نداده‌اید، لطفاً این ایمیل را نادیده بگیرید.</p>
        </div>
      `,
    });

    // 6. Return Success
    return res.json({
      success: true,
      message: "OTP sent successfully",
      expiresAt: expiresAt,
    });
  } catch (error) {
    console.error("[Auth] 💥 Email Error:", error);
    // Return specific error message for frontend debugging
    return res.status(500).json({
      message: "خطا در ارسال ایمیل. لطفاً دوباره تلاش کنید.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
