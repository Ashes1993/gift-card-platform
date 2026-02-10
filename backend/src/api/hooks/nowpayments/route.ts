import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { NowPaymentsService } from "../../../services/nowpayments";
import { completeCartWorkflow } from "@medusajs/medusa/core-flows";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // 1. Get Data from NOWPayments
  const signature = req.headers["x-nowpayments-sig"] as string;
  const body = req.body as any;

  console.log(`[Webhook] 📩 Received NOWPayments IPN:`, body.payment_status);

  // 2. Verify Security
  const service = new NowPaymentsService();
  const isValid = service.verifySignature(signature, body);

  if (!isValid) {
    return res.status(401).json({ message: "Invalid Signature" });
  }

  // 3. Check Status
  if (body.payment_status !== "finished") {
    console.log(
      `[Webhook] ⏳ Payment status is ${body.payment_status}. Waiting...`,
    );
    return res.json({ received: true });
  }

  // 4. Resolve the Cart ID
  const cartId = body.order_id;

  if (!cartId) {
    return res.status(400).json({ message: "No Order ID in webhook" });
  }

  try {
    const query = req.scope.resolve("query");

    // Check if this cart is already an Order (Idempotency)
    const { data: existingOrders } = await query.graph({
      entity: "order",
      fields: ["id"],
      // FIX 2: Cast filters to 'any' to bypass strict metadata typing
      filters: {
        metadata: { original_cart_id: cartId },
      } as any,
    });

    if (existingOrders && existingOrders.length > 0) {
      console.log(
        `[Webhook] ✅ Order already exists for Cart ${cartId}. Skipping.`,
      );
      return res.json({ message: "Already processed" });
    }

    // 5. COMPLETE THE CART
    console.log(`[Webhook] 🛒 Completing Cart ${cartId}...`);

    const { result, errors } = await completeCartWorkflow(req.scope).run({
      input: {
        id: cartId,
      },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].error?.message || "Workflow failed");
    }

    console.log(`[Webhook] 🎉 Order Placed Successfully: ${result.id}`);
    return res.json({ success: true, order_id: result.id });
  } catch (error: any) {
    console.error("[Webhook] 💥 Processing Error:", error.message);
    return res
      .status(200)
      .json({ message: "Error processing", error: error.message });
  }
}
