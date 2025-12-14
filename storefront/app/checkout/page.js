"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { useAccount } from "@/context/account-context";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { placeOrder } from "./actions";

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export default function CheckoutPage() {
  const { cart, setCart } = useCart();
  const { customer } = useAccount();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
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
        <Link href="/store" className="text-blue-600 hover:underline">
          Go to Store
        </Link>
      </div>
    );
  }

  // --- CHECKOUT LOGIC ---
  async function handlePlaceOrder(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get the token from local storage to pass to the server
      const token = localStorage.getItem("medusa_auth_token");

      // Call the Server Action
      const result = await placeOrder({
        cartId: cart.id,
        email: customer ? null : email, // Only send email if guest
        token,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Success!
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-extrabold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* LEFT: Form */}
        <div>
          <form onSubmit={handlePlaceOrder} className="space-y-6">
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
                  disabled={!!customer} // Disable if logged in
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

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                "Place Order (Test)"
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="rounded-lg bg-gray-50 p-6">
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
              <p className="text-base font-medium text-gray-900">
                {/* Calculate Rough Total if cart.total is missing (common in V2 drafts) */}
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h2 className="text-3xl font-extrabold text-gray-900">
        Order Confirmed!
      </h2>
      <p className="mt-2 text-lg text-gray-600">
        Thank you for your purchase. Your order ID is{" "}
        <span className="font-mono font-bold">{orderId}</span>.
      </p>
      <p className="text-gray-500 mt-2">
        Your gift card codes have been sent to your email.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/store"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Buy Another
        </Link>
        <Link
          href="/account/orders"
          className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
