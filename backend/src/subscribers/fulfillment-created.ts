import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function shipmentCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query");

  // 1. SAFETY BUFFER: Wait 1s to ensure the database transaction committed the label
  await sleep(1000);

  try {
    // 2. Fetch Fulfillment + Labels + Order Info
    const { data: fulfillments } = await query.graph({
      entity: "fulfillment",
      fields: [
        "*",
        "labels.tracking_number", // <--- The specific field we need
        "order.display_id",
        "order.email",
        "order.customer.email",
        "items.title",
        "items.quantity",
      ],
      filters: { id: data.id },
    });

    const fulfillment: any = fulfillments[0];

    if (!fulfillment || !fulfillment.order) return;

    // 3. Extract Codes from Labels
    const digitalCodes = (fulfillment.labels || [])
      .map((l: any) => l.tracking_number)
      .filter(Boolean);

    if (digitalCodes.length === 0) {
      // If manual fulfillment didn't include a code, we skip sending the email.
      return;
    }

    // 4. Determine Recipient (Dev Override Active)
    // TODO: When going live, change this to: fulfillment.order.email
    const emailToSend = "ashkaneslamii1993@gmail.com";

    console.log(
      `[Email] 🚀 Sending Digital Delivery for #${fulfillment.order.display_id} to ${emailToSend}`
    );

    // 5. Send Professional HTML Email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [emailToSend],
      subject: `Your Order #${fulfillment.order.display_id} is Ready! 🚀`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Your Digital Order</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f5; margin: 0; padding: 0;">
            
            <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              
              <div style="background: #000; padding: 30px; text-align: center;">
                <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: -0.5px;">Your Digital Content</h1>
              </div>

              <div style="padding: 40px 30px;">
                <p style="margin-top: 0; font-size: 16px; color: #555;">
                  Hi there,
                </p>
                <p style="font-size: 16px; color: #555;">
                  Thank you for your purchase! Your digital order <strong>#${
                    fulfillment.order.display_id
                  }</strong> has been processed and is ready for use.
                </p>

                <div style="margin: 30px 0;">
                  <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 15px;">Your Activation Code(s)</h3>
                  
                  ${digitalCodes
                    .map(
                      (code: string) => `
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 12px;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: 700; color: #15803d; letter-spacing: 2px;">
                        ${code}
                      </span>
                    </div>
                  `
                    )
                    .join("")}
                </div>

                <p style="font-size: 14px; color: #666; background: #fafafa; padding: 15px; border-radius: 6px;">
                  <strong>💡 How to use:</strong><br/>
                  Copy the code above and redeem it on the respective platform immediately. If you have any issues, please reply to this email.
                </p>
              </div>

              <div style="background: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
                <p style="font-size: 12px; color: #999; margin: 0;">
                  &copy; ${new Date().getFullYear()} Gift Card Store. All rights reserved.
                </p>
              </div>
            </div>

          </body>
        </html>
      `,
    });
  } catch (err) {
    console.error("[Email] 💥 Error:", err);
  }
}

export const config: SubscriberConfig = {
  event: "shipment.created",
};
