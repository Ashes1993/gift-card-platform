import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";
import { Resend } from "resend";
import { EmailTemplates } from "../utils/email-templates"; // <--- Import Templates

const resend = new Resend(process.env.RESEND_API_KEY);

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
    if (!order) return;

    // 1. Recipient
    const emailToSend = "ashkaneslamii1993@gmail.com";
    // const emailToSend = order.email;

    console.log(
      `[Email] 🧾 Sending Receipt for #${order.display_id} to ${emailToSend}`,
    );

    // 2. Send Email
    const emailHtml = EmailTemplates.orderReceipt(order);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [emailToSend],
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
