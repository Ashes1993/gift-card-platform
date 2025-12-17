import { MedusaError } from "@medusajs/utils";
// 1. Import ProxyAgent and Dispatcher from undici
import { ProxyAgent, type Dispatcher } from "undici";

export class NowPaymentsService {
  private apiKey: string;
  private apiUrl: string;
  private dispatcher: Dispatcher | undefined;

  constructor() {
    this.apiKey = process.env.NOWPAYMENTS_API_KEY || "";
    this.apiUrl = "https://api.nowpayments.io/v1/"; // Keep hardcoded for safety

    // 2. DETECT PROXY: If we are in dev and have a proxy set, use it.
    const proxyUrl = process.env.DEV_PROXY_URL;
    if (proxyUrl) {
      console.log(
        `[NOWPayments] 🛡️ Routing traffic through Proxy: ${proxyUrl}`
      );
      this.dispatcher = new ProxyAgent(proxyUrl);
    }
  }

  async createInvoice(amount: number, currency: string, orderId: string) {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

    console.log(`[NOWPayments] 🚀 Creating Invoice...`);

    const body = {
      price_amount: amount,
      price_currency: currency,
      pay_currency: "usdtbsc",
      order_id: orderId,
      order_description: `Order #${orderId}`,
      ipn_callback_url: `${backendUrl}/hooks/nowpayments`,
      success_url: `${
        process.env.STORE_URL || "http://localhost:8000"
      }/order/confirmed/${orderId}`,
      cancel_url: `${
        process.env.STORE_URL || "http://localhost:8000"
      }/checkout?error=payment_cancelled`,
    };

    try {
      // 3. Pass the 'dispatcher' to fetch
      // Typescript might complain about 'dispatcher' not being in standard RequestInit,
      // so we cast it as 'any' or use the specific node-fetch types.
      // The cleanest way in Medusa V2 (Node 18+) is passing it directly.

      const response = await fetch(`${this.apiUrl}invoice`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        // @ts-ignore - 'dispatcher' is an undici specific option supported by Node fetch
        dispatcher: this.dispatcher,
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        console.error("NOWPayments Error Response:", data);
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `NOWPayments API Failed: ${JSON.stringify(data)}`
        );
      }

      return data;
    } catch (error: any) {
      console.error("[NOWPayments] 💥 Error:", error.message);
      if (error.cause) console.error("[NOWPayments] Cause:", error.cause);

      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to connect to NOWPayments. Check Proxy Settings."
      );
    }
  }

  verifySignature(signature: string, body: any): boolean {
    return true;
  }
}
