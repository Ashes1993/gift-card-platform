import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";
import { Resend } from "resend";
import { EmailTemplates } from "../utils/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_EMAIL = "NextLicense Delivery <noreply@nextlicense.shop>";
const SUPPORT_EMAIL = "support@nextlicense.shop";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function shipmentCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query");

  // 1. Safety Buffer
  await sleep(1500);

  try {
    // 2. Fetch Fulfillment Data
    const { data: fulfillments } = await query.graph({
      entity: "fulfillment",
      fields: ["*", "labels.*", "order.display_id", "order.email"],
      filters: { id: data.id },
    });

    const fulfillment: any = fulfillments[0];

    // TYPE FIX: Check for order AND email existence
    if (!fulfillment || !fulfillment.order || !fulfillment.order.email) {
      console.warn(
        `[Email] ⚠️ Fulfillment ${data.id} has missing order data or email.`,
      );
      return;
    }

    // 3. Extract Codes & Labels
    const labels = fulfillment.labels || [];

    const digitalItems = labels
      .map((l: any) => ({
        code: l.tracking_number,
        label:
          l.tracking_url && l.tracking_url !== "null"
            ? l.tracking_url
            : "لایسنس دیجیتال",
      }))
      .filter((i: any) => i.code);

    if (digitalItems.length === 0) {
      console.log(
        `[Email] ℹ️ No codes found in fulfillment ${data.id}, skipping email.`,
      );
      return;
    }

    // 4. Recipient
    // Now TypeScript knows this is a string
    const emailToSend: string = fulfillment.order.email;

    console.log(
      `[Email] 🚀 Sending Codes for Order #${fulfillment.order.display_id} to ${emailToSend}`,
    );

    // 5. Send Email
    const emailHtml = EmailTemplates.digitalDelivery(
      fulfillment.order.display_id,
      digitalItems,
    );

    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [emailToSend],
      replyTo: SUPPORT_EMAIL, // FIXED: Changed reply_to -> replyTo
      subject: `سفارش شما آماده است! #${fulfillment.order.display_id} 🚀`,
      html: emailHtml,
    });
  } catch (err) {
    console.error("[Email] 💥 Error sending fulfillment:", err);
  }
}

export const config: SubscriberConfig = {
  event: "shipment.created",
};
