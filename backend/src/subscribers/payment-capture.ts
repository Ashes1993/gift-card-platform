import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";
import { IPaymentModuleService } from "@medusajs/types";
import { Modules } from "@medusajs/framework/utils"; // <--- IMPORT THIS

export default async function autoCapturePayment({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  // FIX: Use 'Modules.PAYMENT' instead of the string "paymentModuleService"
  const paymentService: IPaymentModuleService = container.resolve(
    Modules.PAYMENT,
  );
  const query = container.resolve("query");

  try {
    // 1. Fetch Order with Payment details
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "payment_collections.id",
        "payment_collections.payments.id",
        "payment_collections.payments.amount",
        "payment_collections.payments.captured_at",
      ],
      filters: { id: data.id },
    });

    const order = orders[0];
    if (!order) return;

    // 2. Identify Payments needing capture
    const paymentsToCapture: any[] = [];
    order.payment_collections?.forEach((col: any) => {
      col.payments?.forEach((pay: any) => {
        // Only capture if it has an ID and hasn't been captured yet
        if (pay.id && !pay.captured_at) {
          paymentsToCapture.push(pay);
        }
      });
    });

    // 3. Auto-Capture
    for (const payment of paymentsToCapture) {
      console.log(`[Auto-Capture] 💳 Capturing payment: ${payment.id}`);

      try {
        await paymentService.capturePayment({
          payment_id: payment.id,
          amount: payment.amount,
        });
        console.log(`[Auto-Capture] ✅ Successfully captured ${payment.id}`);
      } catch (innerErr) {
        console.error(
          `[Auto-Capture] ❌ Failed to capture ${payment.id}:`,
          innerErr,
        );
      }
    }
  } catch (err) {
    console.error("[Auto-Capture] ⚠️ Global Error:", err);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
