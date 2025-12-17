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
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link href="/" className="text-blue-600 hover:underline">
          Go to Store
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
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // --- 2. CRYPTO CHECKOUT (New Integration) ---
  async function handleCryptoPayment(e) {
    e.preventDefault();

    // Validation
    if (!email && !customer) {
      setError("Please enter your email address first.");
      return;
    }

    setCryptoLoading(true);
    setError("");

    try {
      // Step A: Ensure Email is attached to Cart (Crucial for Guest Checkout)
      // We manually update the cart here so the backend has the email for the invoice
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
        throw new Error(data.message || "Failed to initialize crypto payment");
      }

      // Step C: Redirect to NOWPayments
      window.location.href = data.payment_url;
    } catch (err) {
      console.error(err);
      setError(err.message || "Crypto payment failed.");
      setCryptoLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-extrabold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* LEFT: Form */}
        <div>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!customer}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                  placeholder="you@example.com"
                />
              </div>
              {!customer && (
                <p className="mt-2 text-xs text-gray-500">
                  We'll send your gift card code to this email.
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4">
              {/* Button 1: Crypto (Primary) */}
              <button
                onClick={handleCryptoPayment}
                disabled={loading || cryptoLoading}
                className="flex w-full items-center justify-center rounded-lg bg-green-600 px-6 py-4 text-base font-bold text-white shadow-md hover:bg-green-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {cryptoLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Bitcoin className="mr-2 h-5 w-5" />
                )}
                Pay with Crypto
              </button>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider">
                  Or pay with card
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Button 2: Credit Card (Test) */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || cryptoLoading}
                className="flex w-full items-center justify-center rounded-lg border-2 border-gray-200 bg-white px-6 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-5 w-5" />
                )}
                Credit Card (Test)
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="rounded-lg bg-gray-50 p-6 h-fit sticky top-24">
          <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          <ul className="mt-6 divide-y divide-gray-200">
            {cart.items.map((item) => (
              <li key={item.id} className="flex py-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(item.unit_price, cart.currency_code)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-base font-medium text-gray-900">Total</p>
              <p className="text-xl font-bold text-gray-900">
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
        </div>
      </div>
    </div>
  );
}

function SuccessView({ orderId }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-green-100 p-4 mb-4">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900">
        Order Confirmed!
      </h2>
      <p className="mt-2 text-lg text-gray-600">
        Thank you for your purchase. Your order ID is{" "}
        <span className="font-mono font-bold text-black">#{orderId}</span>.
      </p>
      <p className="text-gray-500 mt-2 max-w-md mx-auto">
        Your digital gift card codes have been sent to your email address.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
        >
          Buy Another
        </Link>
        <Link
          href="/account/orders"
          className="rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
