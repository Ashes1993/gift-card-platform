"use server";

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export async function submitTicket(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");
  const orderId = formData.get("orderId");

  // 1. Basic Validation
  if (!email || !message || !name) {
    return { success: false, error: "لطفاً تمام فیلدهای اجباری را پر کنید." };
  }

  try {
    const res = await fetch(`${BASE_URL}/store/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": API_KEY,
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        orderId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "خطا در برقراری ارتباط با سرور");
    }

    return { success: true, ticketId: data.ticketId };
  } catch (error) {
    console.error("[Support] 💥 Error:", error);
    return {
      success: false,
      error: "متاسفانه ارسال تیکت انجام نشد. لطفاً دقایقی دیگر تلاش کنید.",
    };
  }
}
