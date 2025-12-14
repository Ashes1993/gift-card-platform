"use server";

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export async function placeOrder({ cartId, email, token }) {
  const headers = {
    "Content-Type": "application/json",
    "x-publishable-api-key": API_KEY,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log(`[Checkout] Starting for Cart: ${cartId}`);

  try {
    // 1. Update Cart Email
    if (email) {
      console.log("[Checkout] Updating email...");
      const emailRes = await fetch(`${BASE_URL}/store/carts/${cartId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email }),
      });
      if (!emailRes.ok)
        console.error("Email Update Failed:", await emailRes.text());
    }

    // --- STEP 2: SHIPPING AUTO-SELECT (DEBUGGING ADDED) ---
    console.log("[Checkout] Fetching shipping options...");
    const optionsRes = await fetch(
      `${BASE_URL}/store/shipping-options?cart_id=${cartId}`,
      {
        headers,
      }
    );

    const optionsData = await optionsRes.json();
    const options = optionsData.shipping_options || [];

    console.log(
      `[Checkout] Found ${options.length} shipping options:`,
      options.map((o) => o.name)
    );

    if (options.length > 0) {
      // Select the first one automatically
      const firstOption = options[0];
      console.log(
        `[Checkout] Auto-selecting option: ${firstOption.name} (${firstOption.id})`
      );

      const addShippingRes = await fetch(
        `${BASE_URL}/store/carts/${cartId}/shipping-methods`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ option_id: firstOption.id }),
        }
      );

      if (!addShippingRes.ok) {
        console.error(
          "[Checkout] Failed to add shipping method:",
          await addShippingRes.text()
        );
        throw new Error("Could not apply shipping method");
      }
      console.log("[Checkout] Shipping method applied successfully.");
    } else {
      console.error(
        "[Checkout] CRITICAL: No shipping options found for this cart/region."
      );
      throw new Error("No shipping options available. Check Region settings.");
    }
    // -------------------------------------------------------

    // 3. Create Payment Collection
    console.log("[Checkout] Creating Payment Collection...");
    const collectionRes = await fetch(`${BASE_URL}/store/payment-collections`, {
      method: "POST",
      headers,
      body: JSON.stringify({ cart_id: cartId }),
    });

    if (!collectionRes.ok) {
      const text = await collectionRes.text();
      console.error("Create Collection Error:", text);
      throw new Error("Failed to create payment collection");
    }

    const collectionData = await collectionRes.json();
    const collectionId = collectionData.payment_collection?.id;

    // 4. Initialize Payment Session (System Default)
    console.log("[Checkout] Initializing Payment Session...");
    const sessionRes = await fetch(
      `${BASE_URL}/store/payment-collections/${collectionId}/payment-sessions`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ provider_id: "pp_system_default" }),
      }
    );

    if (!sessionRes.ok) {
      const text = await sessionRes.text();
      console.error("Payment Session Error:", text);
      throw new Error("Failed to init payment session");
    }

    // 5. Complete Cart
    console.log("[Checkout] Completing Order...");
    const completeRes = await fetch(
      `${BASE_URL}/store/carts/${cartId}/complete`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({}),
      }
    );

    const completeData = await completeRes.json();

    if (!completeRes.ok) {
      console.error("Completion Error:", completeData);
      throw new Error(completeData.message || "Order completion failed");
    }

    return {
      success: true,
      orderId:
        completeData.type === "order" ? completeData.order.id : completeData.id,
    };
  } catch (error) {
    console.error("[Checkout] Server Action Error:", error);
    return { success: false, error: error.message };
  }
}
