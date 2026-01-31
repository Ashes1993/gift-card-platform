"use server";

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

// 1. Request OTP
export async function requestOtpAction(email) {
  console.log("🚀 [Action] Requesting OTP for:", email);

  try {
    const res = await fetch(`${BASE_URL}/store/auth/request-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": API_KEY,
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    console.log("📡 [Action] Request OTP Response:", data);

    if (!res.ok) throw new Error(data.message || "Failed to send OTP");

    return { success: true, expiresAt: data.expiresAt };
  } catch (error) {
    console.error("💥 [Action] Request OTP Error:", error.message);
    return { success: false, error: error.message };
  }
}

// 2. Reset Password
export async function resetPasswordAction(email, otp, password) {
  console.log("🚀 [Action] Resetting Password for:", email);

  try {
    const res = await fetch(`${BASE_URL}/store/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": API_KEY,
      },
      body: JSON.stringify({ email, otp, password }),
    });

    const data = await res.json();
    console.log("📡 [Action] Reset Password Response:", data);

    if (!res.ok) throw new Error(data.message || "Failed to reset password");

    return { success: true };
  } catch (error) {
    console.error("💥 [Action] Reset Password Error:", error.message);
    return { success: false, error: error.message };
  }
}
