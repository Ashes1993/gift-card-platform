import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";
import { Resend } from "resend";
import { EmailTemplates } from "../utils/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function shipmentCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query");

  // 1. SAFETY BUFFER
  await sleep(1000);

  try {
    // 2. Fetch Fulfillment Data
    const { data: fulfillments } = await query.graph({
      entity: "fulfillment",
      fields: [
        "*",
        "labels.*", // Fetches tracking_number, tracking_url, etc.
        "order.display_id",
        "order.email",
      ],
      filters: { id: data.id },
    });

    const fulfillment: any = fulfillments[0];
    if (!fulfillment || !fulfillment.order) return;

    // 3. Extract Codes & Labels
    const labels = fulfillment.labels || [];

    const digitalItems = labels
      .map((l: any) => ({
        // The Code
        code: l.tracking_number,

        // FIX: Map 'tracking_url' to our Label
        // We use tracking_url because that is the field available in the Admin UI
        label:
          l.tracking_url && l.tracking_url !== "null" ? l.tracking_url : "",
      }))
      .filter((i: any) => i.code);

    if (digitalItems.length === 0) return;

    // 4. Recipient
    // DEVELOPMENT MODE:
    const emailToSend = "ashkaneslamii1993@gmail.com";

    // PRODUCTION MODE (Uncomment later):
    // const emailToSend = fulfillment.order.email;

    console.log(
      `[Email] 🚀 Sending Codes for Order #${fulfillment.order.display_id} to ${emailToSend}`,
    );

    // 5. Send Email
    const emailHtml = EmailTemplates.digitalDelivery(
      fulfillment.order.display_id,
      digitalItems,
    );

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [emailToSend],
      subject: `سفارش شما آماده است! #${fulfillment.order.display_id} 🚀`,
      html: emailHtml,
    });
  } catch (err) {
    console.error("[Email] 💥 Error:", err);
  }
}

export const config: SubscriberConfig = {
  event: "shipment.created",
};
