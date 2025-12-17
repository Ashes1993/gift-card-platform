import { MedusaError } from "@medusajs/utils";
// 1. Import dns to force IPv4
import dns from "dns";

// Force Node to look for IPv4 addresses first (Fixes the Timeout issue)
dns.setDefaultResultOrder("ipv4first");

export class NowPaymentsService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.NOWPAYMENTS_API_KEY || "";
    // 2. HARDCODE the URL temporarily to ensure it's correct
    this.apiUrl = "https://api.nowpayments.io/v1/";
  }

  async createInvoice(amount: number, currency: string, orderId: string) {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

    // 3. Log the URL we are hitting (For Debugging)
    console.log(`[NOWPayments] 🚀 Contacting: ${this.apiUrl}invoice`);

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
      // 4. Increase Timeout to 15s (Default is 10s)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${this.apiUrl}invoice`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        console.error("NOWPayments Error Response:", data);
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `NOWPayments API Failed: ${JSON.stringify(data)}`
        );
      }

      return data;
    } catch (error: any) {
      console.error("[NOWPayments] 💥 Network Error:", error);
      if (error.cause) console.error("[NOWPayments] Cause:", error.cause);

      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to connect to NOWPayments. Check your internet connection."
      );
    }
  }

  verifySignature(signature: string, body: any): boolean {
    return true;
  }
}
