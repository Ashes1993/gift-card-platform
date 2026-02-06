import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";
import { Resend } from "resend";
import { EmailTemplates } from "../utils/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_EMAIL = "NextLicense <noreply@nextlicense.shop>";
const SUPPORT_EMAIL = "support@nextlicense.shop";

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query");

  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "display_id",
        "email",
        "total",
        "subtotal",
        "tax_total",
        "currency_code",
        "*items",
        "customer.email",
      ],
      filters: { id: data.id },
    });

    const order = orders[0];

    // TYPE FIX: Check if order exists AND if email is not null
    if (!order || !order.email) {
      console.warn(
        `[Email] ⚠️ Order ${data.id} missing email, skipping receipt.`,
      );
      return;
    }

    // Now TypeScript knows order.email is definitely a string
    const emailToSend: string = order.email;

    console.log(
      `[Email] 🧾 Sending Receipt for #${order.display_id} to ${emailToSend}`,
    );

    const emailHtml = EmailTemplates.orderReceipt(order);

    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [emailToSend],
      replyTo: SUPPORT_EMAIL, // FIXED: Changed reply_to -> replyTo
      subject: `رسید سفارش: #${order.display_id}`,
      html: emailHtml,
    });
  } catch (err) {
    console.error("[Email] 💥 Error sending receipt:", err);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
