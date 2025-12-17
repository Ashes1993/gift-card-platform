import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { NowPaymentsService } from "../../../../services/nowpayments";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { cart_id } = req.body as any;
  const query = req.scope.resolve("query");

  try {
    const { data: carts } = await query.graph({
      entity: "cart",
      fields: ["id", "total", "currency_code", "region.currency_code"],
      filters: { id: cart_id },
    });

    const cart = carts[0] as any;

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // --- CURRENCY CONVERSION LOGIC ---
    let currency = (
      cart.currency_code ||
      cart.region?.currency_code ||
      "usd"
    ).toLowerCase();
    let amount = Number(cart.total);

    // Check if we are dealing with IRR
    if (currency === "irr") {
      const rate = Number(process.env.INTERNAL_EXCHANGE_RATE || "700000");

      console.log(`[Crypto] 💱 Converting IRR to USD. Rate: ${rate}`);

      // Math: Total IRR / Rate = Total USD
      // Note: IRR in Medusa usually has 0 decimal places.
      // If your Medusa setup uses 0 decimals for IRR (standard), use 'amount'.
      // If you hacked it to use 2 decimals, use 'amount / 100'.
      // Assuming standard 0 decimals for IRR:
      amount = amount / rate;

      // Round to 2 decimals for USD (e.g. 10.50)
      amount = Math.round((amount + Number.EPSILON) * 100) / 100;

      // Switch currency tag to USD so NOWPayments accepts it
      currency = "usd";
    } else {
      // Standard logic for USD/EUR (divide by 100 to handle cents)
      amount = amount / 100;
    }

    // Safety check: Don't allow tiny amounts (NOWPayments min limit is usually ~$3-4)
    if (amount < 2) {
      return res.status(400).json({
        success: false,
        message: "Order amount is too low for crypto payment (Min $2).",
      });
    }

    const nowPayments = new NowPaymentsService();

    // Create Invoice with the converted USD amount
    const invoice = await nowPayments.createInvoice(amount, currency, cart_id);

    return res.json({
      success: true,
      payment_url: invoice.invoice_url,
      invoice_id: invoice.id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Could not initialize crypto payment" });
  }
}
