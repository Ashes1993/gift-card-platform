"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Calendar, ChevronRight, AlertCircle } from "lucide-react";
import AccountLayout from "@/components/account/account-layout";
import { formatPrice } from "@/lib/utils";

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const token = localStorage.getItem("medusa_auth_token");

      if (!token) {
        redirect("/account/login");
        return;
      }

      try {
        // FIX: Remove specific 'fields' that cause crashes (like 'total').
        // We just ask for the order and expand the items.
        // We pass the API Key in the URL to avoid header issues here too.
        const res = await fetch(
          `${BASE_URL}/store/orders?limit=20&offset=0&fields=*items,*items.variant`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-publishable-api-key": API_KEY,
            },
          }
        );

        if (!res.ok) {
          console.error("Order fetch error status:", res.status);
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();

        if (data.orders) {
          const sorted = data.orders.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setOrders(sorted);
        }
      } catch (e) {
        console.error("Failed to load orders", e);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <AccountLayout activeTab="orders">
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500 animate-pulse">Loading your orders...</p>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout activeTab="orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Order History
          </h2>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
            {orders.length} Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
            <Package className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500 mb-6">
              You haven't purchased any gift cards yet.
            </p>
            <Link
              href="/store"
              className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
            >
              Browse Store
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="border-b border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.created_at).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        #{order.display_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatPrice(order.total, order.currency_code)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <ul className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center gap-4">
                          {/* Fallback image if thumbnail is missing */}
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                            <img
                              src={
                                item.thumbnail ||
                                "https://placehold.co/100?text=Gift"
                              }
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.unit_price, order.currency_code)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {/* Action Bar */}
                  <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
                    <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                      View Order Details{" "}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
