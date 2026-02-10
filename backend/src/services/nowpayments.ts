import { MedusaError } from "@medusajs/utils";
// FIX 1: Import fetch explicitly from undici to ensure 'dispatcher' works
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
    const proxyUrl = process.env.DEV_PROXY_URL; // e.g., http://127.0.0.1:10809
    if (proxyUrl) {
      console.log(
        `[NOWPayments] 🛡️ Routing traffic through Proxy: ${proxyUrl}`,
      );
      // FIX 2: Relax SSL for local proxies to prevent "fetch failed"
      this.dispatcher = new ProxyAgent({
        uri: proxyUrl,
        connect: {
          rejectUnauthorized: false, // Vital for local proxy tools like v2ray
        },
      });
    }
  }

  /**
   * AUTOMATIC RATE FEATURE
   * Fetches the current USDT price from Nobitex (Iranian Exchange)
   * Falls back to a hardcoded safe limit if API fails.
   */
  async getLiveUsdtRate(): Promise<number> {
    try {
      // Nobitex Public API for USDT/IRT (Toman)
      const res = await fetch("https://api.nobitex.ir/v2/orderbook/USDTIRT", {
        // @ts-ignore
        dispatcher: this.dispatcher, // Use proxy for this too if server is inside Iran
      });

      const data = (await res.json()) as any;

      // Get the lowest "Ask" price (Best price to buy) and convert to Rials (* 10)
      // data.bids[0] = [Price, Amount]
      const bestAskToman = Number(data.bids?.[0]?.[0]);

      if (!bestAskToman || isNaN(bestAskToman)) {
        throw new Error("Invalid data from Nobitex");
      }

      const rateRial = bestAskToman * 10; // Convert Toman to Rial
      console.log(`[Rate] 📈 Live USDT Rate from Nobitex: ${rateRial} IRR`);
      return rateRial;
    } catch (e) {
      console.warn(
        "[Rate] ⚠️ Failed to fetch live rate, using fallback:",
        e.message,
      );
      // Fallback to Env or Safe Default (e.g., 85,000 Toman)
      return Number(process.env.INTERNAL_EXCHANGE_RATE || "1560000");
    }
  }

  async createInvoice(
    amountInRials: number,
    currencyCode: string,
    cartId: string,
  ) {
    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const storeUrl =
      process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:8000";

    // --- AUTOMATIC CONVERSION LOGIC ---
    let finalAmount = amountInRials;
    let finalCurrency = currencyCode.toLowerCase();

    if (finalCurrency === "irr") {
      // 1. Get Live Rate
      const rate = await this.getLiveUsdtRate();

      // 2. Convert to USD
      finalAmount = amountInRials / rate;

      // 3. Round to 2 decimals
      finalAmount = Math.round((finalAmount + Number.EPSILON) * 100) / 100;
      finalCurrency = "usd";

      console.log(
        `[NOWPayments] 💱 Converted ${amountInRials} IRR -> ${finalAmount} USD (Rate: ${rate})`,
      );
    } else {
      // If already USD, divide by 100 (Medusa stores cents)
      finalAmount = finalAmount / 100;
    }

    // Safety check
    if (finalAmount < 2) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Amount too low ($2 Min)",
      );
    }

    const body = {
      price_amount: finalAmount,
      price_currency: finalCurrency,
      pay_currency: "usdtbsc",
      order_id: cartId,
      order_description: `Cart #${cartId}`,
      ipn_callback_url: `${backendUrl}/hooks/nowpayments`,
      success_url: `${storeUrl}/account/orders`,
      cancel_url: `${storeUrl}/checkout?error=payment_cancelled`,
    };

    try {
      // FIX 3: Using 'undici.fetch' specifically
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
      if (error.cause) console.error("Cause:", error.cause);

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
