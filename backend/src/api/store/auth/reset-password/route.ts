import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, otp, password } = req.body as any;

  // 1. Validation
  if (!email || !otp || !password) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and Password are required." });
  }

  // 2. Verify OTP (Global Store)
  const store = (global as any).otpStore;
  const record = store?.[email];

  if (!record || record.code !== otp) {
    return res.status(401).json({ message: "Invalid or expired OTP." });
  }

  if (Date.now() > record.expiresAt) {
    return res.status(401).json({ message: "OTP has expired." });
  }

  // 3. Resolve Services
  const authModuleService = req.scope.resolve(Modules.AUTH);

  try {
    console.log(`[Auth] 🔄 Resetting password for: ${email}`);

    // 4. Update Password using `updateProvider`
    // This method tells the specific provider (emailpass) to update the credential (password)
    // for the given entity (email). It handles hashing automatically and keeps the ID.
    // Note: We cast authModuleService to 'any' purely to bypass potential missing type definitions
    // in the SDK, but this method exists in the underlying module service.
    await (authModuleService as any).updateProvider("emailpass", {
      entity_id: email,
      password: password,
    });

    console.log(`[Auth] ✅ Password updated successfully for: ${email}`);

    // 5. Cleanup OTP
    delete store[email];

    return res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("[Auth] 💥 Reset Password Error:", error);

    // Better Error Handling
    let errorMessage = "Failed to reset password.";
    if (error.message.includes("not found")) {
      errorMessage = "User not found.";
    }

    return res
      .status(500)
      .json({ message: errorMessage, error: error.message });
  }
}
