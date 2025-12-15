import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper: Format currency (Safe version)
const formatMoney = (amount: any, currency: string) => {
  const value = Number(amount) || 0; // Prevents NaN
  return (
    new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 0, // No decimals
    }).format(value) +
    " " +
    (currency ? currency.toUpperCase() : "")
  );
};

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query");

  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "total",
        "currency_code",
        "*items", // <--- FIX: Fetch ALL item fields (ensures quantity & price exist)
        "customer.email",
      ],
      filters: { id: data.id },
    });

    const order = orders[0];
    if (!order) return;

    // 1. Determine Recipient (Dev Override)
    const emailToSend = "ashkaneslamii1993@gmail.com";

    console.log(
      `[Email] 🧾 Sending Receipt for #${order.display_id} to ${emailToSend}`
    );

    // 2. Send Professional Receipt
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [emailToSend],
      subject: `Order Received: #${order.display_id}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Order Receipt</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f5; margin: 0; padding: 0;">
            
            <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              
              <div style="background: #000; padding: 30px; text-align: center;">
                <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: -0.5px;">Order Confirmation</h1>
              </div>

              <div style="padding: 40px 30px;">
                <p style="margin-top: 0; font-size: 16px; color: #555;">
                  Hi there,
                </p>
                <p style="font-size: 16px; color: #555;">
                  Thanks for your purchase! We have received your order <strong>#${
                    order.display_id
                  }</strong> and are currently processing it.
                </p>
                
                <div style="background: #fffbe6; border: 1px solid #ffe58f; border-radius: 6px; padding: 15px; margin: 20px 0; font-size: 14px; color: #8a6d3b;">
                  <strong>Note:</strong> You will receive a separate email with your digital activation codes shortly.
                </div>

                <div style="margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 20px;">
                  <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 15px;">Order Summary</h3>
                  
                  <table style="width: 100%; border-collapse: collapse;">
                    ${(order.items || [])
                      .map(
                        (item: any) => `
                      <tr style="border-bottom: 1px solid #f0f0f0;">
                        <td style="padding: 12px 0; color: #333;">
                          <strong>${
                            item.title
                          }</strong> <span style="color: #888; font-size: 12px;">(x${
                          item.quantity
                        })</span>
                        </td>
                        <td style="padding: 12px 0; text-align: right; font-weight: 500; color: #333;">
                          ${formatMoney(
                            item.unit_price * item.quantity,
                            order.currency_code
                          )}
                        </td>
                      </tr>
                    `
                      )
                      .join("")}
                    
                    <tr>
                      <td style="padding-top: 15px; font-weight: bold; color: #000;">Total</td>
                      <td style="padding-top: 15px; text-align: right; font-weight: bold; color: #000; font-size: 18px;">
                         ${formatMoney(order.total, order.currency_code)}
                      </td>
                    </tr>
                  </table>
                </div>

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
    console.error("[Email] 💥 Error sending receipt:", err);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
