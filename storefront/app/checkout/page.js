"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { useAccount } from "@/context/account-context";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Bitcoin,
  ShoppingBag,
  Receipt,
} from "lucide-react";
import { placeOrder } from "./actions";

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export default function CheckoutPage() {
  const { cart, setCart } = useCart();
  const { customer } = useAccount();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Auto-fill email
  useEffect(() => {
    if (customer?.email) setEmail(customer.email);
  }, [customer]);

  // Empty State
  if (!cart || !cart.items?.length) {
    if (success) return <SuccessView orderId={orderId} />;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-2">
          <ShoppingBag className="h-10 w-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          سبد خرید شما خالی است
        </h2>
        <Link
          href="/store"
          className="text-blue-600 hover:underline font-medium"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  // --- 1. SIMULATION PAYMENT (Manual) ---
  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!email && !customer) {
      setError("لطفاً ایمیل خود را وارد کنید.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("medusa_auth_token");
      const result = await placeOrder({
        cartId: cart.id,
        email: customer ? null : email,
        token,
      });

      if (!result.success) throw new Error(result.error);

      setOrderId(result.orderId);
      setSuccess(true);
      setCart(null);
      localStorage.removeItem("cart_id");
    } catch (err) {
      console.error(err);
      setError(err.message || "خطایی رخ داد. لطفا مجددا تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  // --- 2. CRYPTO PAYMENT ---
  async function handleCryptoPayment(e) {
    e.preventDefault();
    if (!email && !customer) {
      setError("لطفاً ابتدا ایمیل خود را وارد کنید.");
      return;
    }

    setCryptoLoading(true);
    setError("");

    try {
      // Step A: Link Email if Guest
      if (!customer) {
        await fetch(`${BASE_URL}/store/carts/${cart.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": API_KEY,
          },
          body: JSON.stringify({ email }),
        });
      }

      // Step B: Get Crypto Link
      const res = await fetch(`${BASE_URL}/store/payment/crypto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": API_KEY,
        },
        body: JSON.stringify({ cart_id: cart.id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "خطا در ایجاد درگاه پرداخت.");
      }

      // Step C: Redirect
      window.location.href = data.payment_url;
    } catch (err) {
      console.error(err);
      setError(err.message || "پرداخت ناموفق بود.");
      setCryptoLoading(false);
    }
  }

  // --- DYNAMIC TAX CALCULATION ---
  // Calculates the percentage based on backend values to be consistent
  const taxPercentage =
    cart.subtotal > 0 ? Math.round((cart.tax_total / cart.subtotal) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <Receipt className="h-8 w-8 text-black" />
        <h1 className="text-3xl font-extrabold text-gray-900">تسویه حساب</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* --- RIGHT COLUMN: Checkout Form (lg:col-span-7) --- */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <form className="space-y-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                اطلاعات تماس
              </h3>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  ایمیل دریافت کد
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!customer}
                  className="block w-full rounded-xl border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-4 outline-none text-left dir-ltr bg-gray-50 focus:bg-white transition-colors"
                  placeholder="you@example.com"
                />
                {!customer && (
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    کد گیفت کارت فقط به این آدرس ارسال می‌شود.
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleCryptoPayment}
                disabled={loading || cryptoLoading}
                className="group flex w-full items-center justify-between rounded-xl bg-[#00D54B] px-6 py-5 text-white shadow-md hover:bg-[#00c040] hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <Bitcoin className="h-6 w-6" />
                  <span className="text-lg font-bold">
                    پرداخت با ارز دیجیتال
                  </span>
                </div>
                {cryptoLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-gray-200"></div>
                <span className="shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">
                  یا روش جایگزین
                </span>
                <div className="grow border-t border-gray-200"></div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || cryptoLoading}
                className="group flex w-full items-center justify-between rounded-xl border-2 border-gray-200 bg-white px-6 py-5 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-gray-400 group-hover:text-gray-600" />
                  <span className="text-lg font-bold">
                    پرداخت تستی (شبیه‌ساز)
                  </span>
                </div>
                {loading && (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* --- LEFT COLUMN: Order Summary (lg:col-span-5) --- */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="sticky top-24 rounded-3xl bg-gray-50 p-6 border border-gray-200/60 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              خلاصه سفارش
            </h2>
            <ul className="space-y-4">
              {cart.items.map((item) => {
                const variantLabel =
                  item.metadata?.title ||
                  item.variant?.title
                    ?.replace("Gift Card", "")
                    .replace("Card", "")
                    .trim() ||
                  "دیجیتال";

                return (
                  <li
                    key={item.id}
                    className="flex justify-between items-start pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                          {variantLabel}
                        </span>
                        <span className="text-xs text-gray-500">
                          x {item.quantity}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900 font-mono">
                      {formatPrice(
                        item.unit_price * item.quantity,
                        cart.currency_code,
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>جمع جزء</span>
                <span>{formatPrice(cart.subtotal, cart.currency_code)}</span>
              </div>

              {/* TAX SECTION: Dynamic Label and Value */}
              {cart.tax_total > 0 && (
                <div className="flex items-center justify-between text-sm text-red-600 font-medium">
                  {/* Shows dynamic percentage if > 0, otherwise just title */}
                  <span>
                    مالیات بر ارزش افزوده
                    {taxPercentage > 0 && ` (${taxPercentage}٪)`}
                  </span>
                  <span>{formatPrice(cart.tax_total, cart.currency_code)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xl font-black text-gray-900 pt-2">
                <span>مبلغ قابل پرداخت</span>
                <span>{formatPrice(cart.total, cart.currency_code)}</span>
              </div>
            </div>

            <p className="mt-6 text-[10px] text-gray-400 text-center leading-tight">
              با تکمیل خرید، قوانین و مقررات فروشگاه نکست لایسنس را می‌پذیرید.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessView({ orderId }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 animate-in fade-in duration-700">
      <div className="rounded-full bg-green-50 p-6 mb-8 ring-8 ring-green-50/50">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>
      <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
        خرید شما موفقیت‌آمیز بود!
      </h2>
      <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto">
        کد گیفت کارت به ایمیل شما ارسال شد. همچنین می‌توانید جزئیات سفارش را در
        پنل کاربری مشاهده کنید.
      </p>

      <div className="bg-gray-50 rounded-2xl p-4 mb-10 border border-gray-100 inline-block min-w-[200px]">
        <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">
          شماره سفارش
        </span>
        <span className="font-mono text-2xl font-bold text-gray-900 tracking-widest">
          #{orderId}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link
          href="/store"
          className="rounded-xl bg-black px-8 py-4 text-base font-bold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          خرید مجدد
        </Link>
        <Link
          href="/account/orders"
          className="rounded-xl border-2 border-gray-100 bg-white px-8 py-4 text-base font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all"
        >
          پیگیری سفارش
        </Link>
      </div>
    </div>
  );
}
