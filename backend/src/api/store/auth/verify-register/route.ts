import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, otp } = req.body as { email: string; otp: string };

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and Code are required." });
  }

  const store = (global as any).otpStore;
  const record = store?.[email];

  // 1. Check if record exists
  if (!record) {
    return res.status(400).json({
      message: "No code requested for this email. Please request a new code.",
    });
  }

  // 2. Check Expiry (1 Minute Logic)
  if (Date.now() > record.expiresAt) {
    // Optional: Clean up expired record immediately
    delete store[email];
    return res.status(401).json({
      message: "Code expired. Please request a new one.",
    });
  }

  // 3. Verify Code match
  if (record.code !== otp) {
    return res.status(401).json({ message: "Invalid code." });
  }

  // 4. Success: Clear OTP to prevent reuse
  delete store[email];

  console.log(`[Auth] ✅ OTP Verified for ${email}`);

  return res.json({
    success: true,
    message: "Verified",
  });
}
