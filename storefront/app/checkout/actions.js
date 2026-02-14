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

  console.log(`[Checkout] 🚀 STARTING for Cart: ${cartId}`);

  try {
    // --- STEP 1: PREPARE CART EMAIL & CONTEXT ---
    let emailToUpdate = email;
    let customerIdToUpdate = undefined; // <-- FIX: Added variable to hold the ID

    if (token) {
      try {
        const customerRes = await fetch(`${BASE_URL}/store/customers/me`, {
          headers,
          cache: "no-store",
        });
        const customerData = await customerRes.json();

        // FIX: Extract BOTH email and id from the verified token
        if (customerData.customer) {
          emailToUpdate = customerData.customer.email || emailToUpdate;
          customerIdToUpdate = customerData.customer.id;
        }
      } catch (e) {
        console.warn("Could not fetch customer profile, using form email.");
      }
    }

    const updateRes = await fetch(`${BASE_URL}/store/carts/${cartId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: emailToUpdate,
        customer_id: customerIdToUpdate, // <-- FIX: Explicitly bind the user to the cart
        region_id: undefined,
        country_code: "ir",
      }),
    });

    if (!updateRes.ok)
      console.warn("⚠️ Cart Update Warning:", await updateRes.text());

    // --- STEP 2: SHIPPING ---
    const optionsRes = await fetch(
      `${BASE_URL}/store/shipping-options?cart_id=${cartId}`,
      { headers, cache: "no-store" },
    );
    const optionsData = await optionsRes.json();
    const options = optionsData.shipping_options || [];

    if (options.length === 0) {
      throw new Error(
        "No shipping option configured for this region. Please contact support.",
      );
    }

    const shippingRes = await fetch(
      `${BASE_URL}/store/carts/${cartId}/shipping-methods`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ option_id: options[0].id }),
      },
    );

    if (!shippingRes.ok) throw new Error("Failed to set shipping method.");

    // --- STEP 3: PAYMENT SESSIONS ---
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
      },
    );

    if (!sessionRes.ok) throw new Error("Failed to init payment session");

    // --- STEP 4: COMPLETE ORDER ---
    console.log("[Checkout] ✅ Completing Order...");
    const completeRes = await fetch(
      `${BASE_URL}/store/carts/${cartId}/complete`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({}),
      },
    );

    const completeData = await completeRes.json();

    if (!completeRes.ok) {
      throw new Error(completeData.message || "Order completion failed");
    }

    const orderObj =
      completeData.type === "order" ? completeData.order : completeData;

    return {
      success: true,
      orderId: orderObj.id,
      displayId: orderObj.display_id,
    };
  } catch (error) {
    console.error("[Checkout] 💥 Error:", error);
    return { success: false, error: error.message };
  }
}
