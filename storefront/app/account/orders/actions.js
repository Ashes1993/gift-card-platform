"use server";

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export async function listOrders(token, page = 1, limit = 10) {
  if (!token) return { success: false, error: "Not authorized" };

  try {
    const offset = (page - 1) * limit;

    // OPTIMIZATION: Request 'items.metadata' explicitly
    // This ensures our custom labels (e.g. { title: "$10" }) are never stripped out.
    const fields = "*items,*items.variant,*items.metadata";

    const res = await fetch(
      `${BASE_URL}/store/orders?offset=${offset}&limit=${limit}&fields=${fields}&order=-created_at`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-publishable-api-key": API_KEY,
        },
        // CRITICAL: Order history must always be live.
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.error("Fetch Orders Error:", res.status, await res.text());
      return { success: false, error: "Failed to fetch orders" };
    }

    const data = await res.json();
    let orders = data.orders || [];

    // Fallback client-side sort (safety net)
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return {
      success: true,
      orders,
      count: data.count || 0,
      limit: data.limit,
      offset: data.offset,
    };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message };
  }
}
