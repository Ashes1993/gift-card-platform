import { MedusaError } from "@medusajs/utils";
import { ProxyAgent, fetch, type Dispatcher } from "undici";
import crypto from "crypto";

export class NowPaymentsService {
  private apiKey: string;
  private ipnSecret: string;
  private apiUrl: string;
  private dispatcher: Dispatcher | undefined;

  constructor() {
    this.apiKey = process.env.NOWPAYMENTS_API_KEY || "";
    this.ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || this.apiKey;
    this.apiUrl = "https://api.nowpayments.io/v1/";

    // PROXY SUPPORT (For Iran Servers)
    const proxyUrl = process.env.DEV_PROXY_URL;
    if (proxyUrl) {
      console.log(
        `[NOWPayments] 🛡️ Routing traffic through Proxy: ${proxyUrl}`,
      );
      this.dispatcher = new ProxyAgent({
        uri: proxyUrl,
        connect: { rejectUnauthorized: false },
      });
    }
  }

  async getLiveUsdtRate(): Promise<number> {
    try {
      // Nobitex v3 Public API for USDT/IRT
      const res = await fetch("https://apiv2.nobitex.ir/v3/orderbook/USDTIRT", {
        // @ts-ignore
        dispatcher: this.dispatcher,
      });

      const data = (await res.json()) as any;

      // Extract the highest bidder price from the v3 structure
      const bestAsk = Number(data.USDTIRT?.bids?.[0]?.[0]);

      if (!bestAsk || isNaN(bestAsk)) {
        throw new Error("Invalid data from Nobitex");
      }

      // The API already returns Rial, so no conversion needed!
      const rateRial = bestAsk;
      console.log(`[Rate] 📈 Live USDT Rate from Nobitex: ${rateRial} IRR`);

      return rateRial;
    } catch (e: any) {
      console.warn(
        "[Rate] ⚠️ Failed to fetch live rate, using fallback:",
        e.message,
      );
      // Fallback to Env or Safe Default (e.g., 1,600,000 Rial)
      return Number(process.env.INTERNAL_EXCHANGE_RATE || "1600000");
    }
  }

  // FIX: Added payCurrency parameter
  async createInvoice(
    amountInRials: number,
    currencyCode: string,
    cartId: string,
    payCurrency?: string,
  ) {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const storeUrl =
      process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:8000";

    let finalAmount = amountInRials;
    let finalCurrency = currencyCode.toLowerCase();

    if (finalCurrency === "irr") {
      const rate = await this.getLiveUsdtRate();
      finalAmount = amountInRials / rate;
      finalAmount = Math.round((finalAmount + Number.EPSILON) * 100) / 100;
      finalCurrency = "usd";

      console.log(
        `[NOWPayments] 💱 Converted ${amountInRials} IRR -> ${finalAmount} USD (Rate: ${rate})`,
      );
    } else {
      finalAmount = finalAmount / 100;
    }

    if (finalAmount < 2) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Amount too low ($2 Min)",
      );
    }

    // Payload configuration
    const body: Record<string, any> = {
      price_amount: finalAmount,
      price_currency: finalCurrency,
      order_id: cartId,
      order_description: `Cart #${cartId}`,
      ipn_callback_url: `${backendUrl}/hooks/nowpayments`,
      success_url: `${storeUrl}/account/orders`,
      cancel_url: `${storeUrl}/checkout?error=payment_cancelled`,
    };

    // FIX: If the user selected a specific coin, route them directly to it.
    // If not, NOWPayments will show them a UI to pick from your enabled coins.
    if (payCurrency) {
      body.pay_currency = payCurrency.toLowerCase();
    }

    try {
      const response = await fetch(`${this.apiUrl}invoice`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        // @ts-ignore
        dispatcher: this.dispatcher,
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `NOWPayments API Failed: ${JSON.stringify(data)}`,
        );
      }

      return data;
    } catch (error: any) {
      console.error("[NOWPayments] 💥 Error:", error.message);
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to connect to NOWPayments.",
      );
    }
  }

  verifySignature(signature: string, body: any): boolean {
    if (!this.ipnSecret) return true;

    const hmac = crypto.createHmac("sha512", this.ipnSecret);
    hmac.update(JSON.stringify(body));
    const calculatedSignature = hmac.digest("hex");

    if (calculatedSignature === signature) return true;

    console.warn(
      `[NOWPayments] ⚠️ Signature Mismatch! Expected: ${calculatedSignature}, Got: ${signature}`,
    );
    return process.env.NODE_ENV === "development";
  }
}
