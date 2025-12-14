"use server";

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export async function placeOrder({ cartId, email, token }) {
  const headers = {
    "Content-Type": "application/json",
    "x-publishable-api-key": API_KEY,
  };

  // 1. ATTACH TOKEN (Crucial: This is how Medusa identifies the user)
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log(`[Checkout] 🚀 STARTING for Cart: ${cartId}`);

  try {
    // --- STEP 1: LINK CUSTOMER ---
    // We update the email. Because we are sending the 'Authorization' header,
    // Medusa will AUTOMATICALLY link the cart to the logged-in customer.
    // We DO NOT send 'customer_id' in the body (that causes the 400 error).

    let emailToUpdate = email;

    // If logged in, prefer the account email to ensure consistency
    if (token) {
      try {
        const customerRes = await fetch(`${BASE_URL}/store/customers/me`, {
          headers,
        });
        const customerData = await customerRes.json();
        if (customerData.customer?.email) {
          emailToUpdate = customerData.customer.email;
          console.log(`[Checkout] 👤 Auth User Detected: ${emailToUpdate}`);
        }
      } catch (e) {
        console.warn(
          "Could not fetch customer profile, sticking to form email."
        );
      }
    }

    console.log(
      `[Checkout] 🔄 Linking Cart & Updating Email to: ${emailToUpdate}`
    );

    const updateRes = await fetch(`${BASE_URL}/store/carts/${cartId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: emailToUpdate,
        // REMOVED: customer_id (This was the cause of the crash)
      }),
    });

    if (!updateRes.ok) {
      // If this fails, we log it but don't stop.
      // Sometimes a cart is already linked or email is same.
      console.error("⚠️ Cart Update Warning:", await updateRes.text());
    } else {
      const updateData = await updateRes.json();
      const linkedId = updateData.cart?.customer_id;
      console.log(
        `[Checkout] ✅ Cart Update Success. Linked Customer ID: ${
          linkedId || "Guest"
        }`
      );
    }

    // --- STEP 2: SHIPPING ---
    const optionsRes = await fetch(
      `${BASE_URL}/store/shipping-options?cart_id=${cartId}`,
      { headers }
    );
    const optionsData = await optionsRes.json();
    const options = optionsData.shipping_options || [];

    if (options.length > 0) {
      await fetch(`${BASE_URL}/store/carts/${cartId}/shipping-methods`, {
        method: "POST",
        headers,
        body: JSON.stringify({ option_id: options[0].id }),
      });
    }

    // --- STEP 3: PAYMENT ---
    const collectionRes = await fetch(`${BASE_URL}/store/payment-collections`, {
      method: "POST",
      headers,
      body: JSON.stringify({ cart_id: cartId }),
    });

    if (!collectionRes.ok)
      throw new Error("Failed to create payment collection");

    const collectionData = await collectionRes.json();
    const collectionId = collectionData.payment_collection?.id;

    const sessionRes = await fetch(
      `${BASE_URL}/store/payment-collections/${collectionId}/payment-sessions`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ provider_id: "pp_system_default" }),
      }
    );

    if (!sessionRes.ok) throw new Error("Failed to init payment session");

    // --- STEP 4: COMPLETE ---
    console.log("[Checkout] ✅ Completing Order...");
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
      throw new Error(completeData.message || "Order completion failed");
    }

    return {
      success: true,
      orderId:
        completeData.type === "order" ? completeData.order.id : completeData.id,
    };
  } catch (error) {
    console.error("[Checkout] 💥 Error:", error);
    return { success: false, error: error.message };
  }
}
