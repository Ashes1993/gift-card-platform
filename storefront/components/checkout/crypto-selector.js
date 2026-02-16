"use client";

import { useState } from "react";
import { Loader2, Wallet } from "lucide-react";
import { prepareCartForCheckout } from "@/app/checkout/actions";

// The exact coin codes mapped to NOWPayments
const CRYPTO_OPTIONS = [
  {
    id: "usdttrc20",
    name: "USDT",
    network: "Tron (TRC-20)",
    fee: "کارمزد ناچیز",
    color: "border-green-500",
    bg: "bg-green-50/40",
  },
  {
    id: "usdtbsc",
    name: "USDT",
    network: "BSC (BEP-20)",
    fee: "کارمزد ناچیز",
    color: "border-yellow-500",
    bg: "bg-yellow-50/40",
  },
  {
    id: "usdcmatic",
    name: "USDC",
    network: "Polygon",
    fee: "بدون کارمزد",
    color: "border-purple-500",
    bg: "bg-purple-50/40",
  },
  {
    id: "ltc",
    name: "Litecoin",
    network: "LTC Network",
    fee: "کارمزد ناچیز",
    color: "border-blue-500",
    bg: "bg-blue-50/40",
  },
];

export default function CryptoSelector({ cartId, email, customer, onError }) {
  const [selectedCoin, setSelectedCoin] = useState(CRYPTO_OPTIONS[0].id);
  const [loading, setLoading] = useState(false); // <-- Add this to your imports at the top

  // ... inside your component:
  const handleCryptoPayment = async (e) => {
    e.preventDefault();

    if (!email && !customer) {
      onError("لطفاً ایمیل خود را برای دریافت کد گیفت‌کارت وارد کنید.");
      return;
    }

    setLoading(true);
    onError("");

    try {
      const BASE_URL =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
      const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
      const token = localStorage.getItem("medusa_auth_token");

      // --- NEW: Step 1: Fully Prepare the Cart ---
      const prepResult = await prepareCartForCheckout({
        cartId,
        email: customer ? null : email,
        token,
      });

      if (!prepResult.success) {
        throw new Error(prepResult.error || "خطا در آماده‌سازی سبد خرید.");
      }

      // --- Step 2: Request Crypto Invoice ---
      const res = await fetch(`${BASE_URL}/store/payment/crypto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": API_KEY,
        },
        body: JSON.stringify({
          cart_id: cartId,
          pay_currency: selectedCoin,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "خطا در برقراری ارتباط با درگاه ارزی.");
      }

      // Step 3: Redirect to NOWPayments
      window.location.href = data.payment_url;
    } catch (err) {
      console.error(err);
      onError(err.message || "پرداخت ناموفق بود. لطفا مجددا تلاش کنید.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-6">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
          <Wallet className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            پرداخت با ارز دیجیتال
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            تایید آنی و بدون قطعی (پیشنهادی)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CRYPTO_OPTIONS.map((coin) => (
          <label
            key={coin.id}
            className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all hover:bg-gray-50 ${
              selectedCoin === coin.id
                ? `${coin.color} ${coin.bg}`
                : "border-gray-100"
            }`}
          >
            <input
              type="radio"
              name="crypto_network"
              value={coin.id}
              checked={selectedCoin === coin.id}
              onChange={() => setSelectedCoin(coin.id)}
              className="sr-only"
            />
            <span className="font-bold text-gray-900">{coin.name}</span>
            <span className="text-xs text-gray-500 mt-0.5">{coin.network}</span>
            <span className="mt-3 inline-flex w-fit rounded bg-white border border-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600 shadow-sm">
              {coin.fee}
            </span>
          </label>
        ))}
      </div>

      <button
        onClick={handleCryptoPayment}
        disabled={loading}
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00D54B] px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-[#00c040] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            در حال انتقال به درگاه...
          </>
        ) : (
          "پرداخت امن ارزی"
        )}
      </button>
    </div>
  );
}
