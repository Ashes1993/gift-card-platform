"use server";

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export async function listOrders(token) {
  if (!token) return { success: false, error: "Not authorized" };

  try {
    // CORRECT V2 ENDPOINT: /store/orders
    // We pass the token, and Medusa filters for that user automatically.
    // We request fields to show items and their variants (images/titles).
    const res = await fetch(
      `${BASE_URL}/store/orders?fields=*items,*items.variant`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-publishable-api-key": API_KEY, // <--- Crucial Header
        },
        cache: "no-store", // Ensure we always get fresh data
      }
    );

    if (!res.ok) {
      console.error("Fetch Orders Error:", res.status, await res.text());
      return { success: false, error: "Failed to fetch orders" };
    }

    const data = await res.json();

    // Medusa V2 returns { orders: [...] }
    const orders = data.orders || [];

    // Sort by date (Newest first)
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return { success: true, orders };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message };
  }
}
