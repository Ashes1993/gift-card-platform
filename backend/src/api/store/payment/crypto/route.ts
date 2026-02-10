import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { NowPaymentsService } from "../../../../services/nowpayments";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { cart_id } = req.body as any;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const { data: carts } = await query.graph({
      entity: "cart",
      fields: ["id", "total", "currency_code"],
      filters: { id: cart_id },
    });

    const cart = carts[0] as any;

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const nowPayments = new NowPaymentsService();

    // We pass the raw Medusa amount (integer) and currency.
    // The Service handles the Live Rate conversion now.
    const invoice = await nowPayments.createInvoice(
      Number(cart.total),
      cart.currency_code,
      cart_id,
    );

    return res.json({
      success: true,
      payment_url: invoice.invoice_url,
      invoice_id: invoice.id,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Could not initialize crypto payment",
    });
  }
}
