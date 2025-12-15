import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, otp } = req.body as any;

  // 1. Verify OTP
  // We check the global store we created in the request-otp route
  const record = (global as any).otpStore?.[email];

  if (!record) {
    return res
      .status(401)
      .json({ message: "No verification code found for this email." });
  }

  if (record.code !== otp) {
    return res.status(401).json({ message: "Invalid code. Please try again." });
  }

  if (Date.now() > record.expires) {
    return res
      .status(401)
      .json({ message: "Code expired. Please request a new one." });
  }

  // 2. OTP Valid! Clear it to prevent reuse
  delete (global as any).otpStore[email];

  console.log(`[Auth] ✅ OTP Verified for ${email}`);

  // 3. Return Success
  // The frontend will receive this "true" signal and immediately call the actual Register endpoint.
  return res.json({
    success: true,
    message: "Verified",
  });
}
