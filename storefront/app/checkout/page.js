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
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { placeOrder } from "./actions";

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export default function CheckoutPage() {
  const { cart, setCart } = useCart();
  const { customer } = useAccount();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // For Credit Card
  const [cryptoLoading, setCryptoLoading] = useState(false); // For Crypto
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Auto-fill email if logged in
  useEffect(() => {
    if (customer?.email) setEmail(customer.email);
  }, [customer]);

  if (!cart || !cart.items?.length) {
    if (success) return <SuccessView orderId={orderId} />;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
          <ShoppingBag className="h-8 w-8 text-gray-300" />
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

  // --- 1. STANDARD CHECKOUT (Test/Credit Card) ---
  async function handlePlaceOrder(e) {
    e.preventDefault();
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

  // --- 2. CRYPTO CHECKOUT (New Integration) ---
  async function handleCryptoPayment(e) {
    e.preventDefault();

    // Validation
    if (!email && !customer) {
      setError("لطفاً ابتدا ایمیل خود را وارد کنید.");
      return;
    }

    setCryptoLoading(true);
    setError("");

    try {
      // Step A: Ensure Email is attached to Cart (Crucial for Guest Checkout)
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

      // Step B: Request Crypto Invoice
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

      // Step C: Redirect to NOWPayments
      window.location.href = data.payment_url;
    } catch (err) {
      console.error(err);
      setError(err.message || "پرداخت ناموفق بود.");
      setCryptoLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-extrabold text-gray-900">تسویه حساب</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* LEFT: Form (In RTL layout this appears on Right, which is correct) */}
        <div>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                ایمیل دریافت کد
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!customer}
                  // dir-ltr ensures email looks correct (english) while keeping placeholder right-aligned if needed
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 outline-none text-left dir-ltr"
                  placeholder="you@example.com"
                />
              </div>
              {!customer && (
                <p className="mt-2 text-xs text-gray-500">
                  کد گیفت کارت به این آدرس ایمیل ارسال خواهد شد.
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="mr-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4">
              {/* Button 1: Crypto (Primary) */}
              <button
                onClick={handleCryptoPayment}
                disabled={loading || cryptoLoading}
                className="flex w-full items-center justify-center rounded-xl bg-green-600 px-6 py-4 text-base font-bold text-white shadow-md hover:bg-green-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {cryptoLoading ? (
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                ) : (
                  <Bitcoin className="ml-2 h-5 w-5" />
                )}
                پرداخت با ارز دیجیتال
              </button>
              <p className="text-xs text-center text-gray-400">
                پشتیبانی از تتر (USDT)، بیت‌کوین، اتریوم و ...
              </p>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-gray-200"></div>
                <span className="shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">
                  یا پرداخت ریالی (تست)
                </span>
                <div className="grow border-t border-gray-200"></div>
              </div>

              {/* Button 2: Credit Card (Test) */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || cryptoLoading}
                className="flex w-full items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                ) : (
                  <CreditCard className="ml-2 h-5 w-5" />
                )}
                پرداخت تستی (شبیه‌ساز)
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="rounded-2xl bg-gray-50 p-6 h-fit sticky top-24 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">خلاصه سفارش</h2>
          <ul className="mt-6 divide-y divide-gray-200">
            {cart.items.map((item) => (
              <li key={item.id} className="flex py-4">
                <div className="flex-1 ml-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    تعداد: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                  {formatPrice(item.unit_price, cart.currency_code)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-base font-medium text-gray-900">جمع کل</p>
              <p className="text-xl font-black text-blue-600">
                {cart.total
                  ? formatPrice(cart.total, cart.currency_code)
                  : formatPrice(
                      cart.items.reduce(
                        (acc, i) => acc + i.unit_price * i.quantity,
                        0
                      ),
                      cart.currency_code
                    )}
              </p>
            </div>
          </div>

          {/* Trust Badges (Visual Reassurance) */}
          <div className="mt-8 grid grid-cols-3 gap-2 opacity-60 grayscale">
            {/* You can add icons of banks or crypto here later */}
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessView({ orderId }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-green-100 p-4 mb-6 shadow-sm">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900">
        سفارش با موفقیت ثبت شد!
      </h2>
      <p className="mt-4 text-lg text-gray-600">
        از خرید شما سپاسگزاریم. شماره سفارش شما:{" "}
        <span className="font-mono font-bold text-black dir-ltr inline-block bg-gray-100 px-2 py-1 rounded">
          #{orderId}
        </span>
      </p>
      <p className="text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
        کد گیفت کارت‌ها به آدرس ایمیل شما ارسال شد. همچنین می‌توانید آن‌ها را در
        بخش سفارش‌های من مشاهده کنید.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
        >
          خرید مجدد
        </Link>
        <Link
          href="/account/orders"
          className="rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
        >
          مشاهده سفارش‌های من
        </Link>
      </div>
    </div>
  );
}
