"use client";

import { useEffect, useState } from "react";
import { listOrders } from "./actions";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import AccountLayout from "@/components/account/account-layout"; // Wraps the page in the dashboard menu
import { motion } from "framer-motion";
import {
  Loader2,
  Package,
  Calendar,
  CreditCard,
  ChevronRight,
  ShoppingBag,
  Clock,
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("medusa_auth_token");
      // Redirect handled by layout or middleware usually, but safe check here
      if (!token) {
        setLoading(false);
        return;
      }

      const result = await listOrders(token);
      if (result.success) {
        setOrders(result.orders);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <AccountLayout activeTab="orders">
        <div className="flex h-[400px] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
        </div>
      </AccountLayout>
    );
  }

  // --- EMPTY STATE ---
  if (orders.length === 0) {
    return (
      <AccountLayout activeTab="orders">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-20 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
            <ShoppingBag className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="mt-6 text-base font-semibold text-gray-900">
            No orders yet
          </h3>
          <p className="mt-1 max-w-xs text-sm text-gray-500">
            Looks like you haven't made your first purchase yet.
          </p>
          <Link
            href="/store"
            className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 hover:shadow-lg"
          >
            Start Shopping
          </Link>
        </motion.div>
      </AccountLayout>
    );
  }

  // --- MAIN LIST STATE ---
  return (
    <AccountLayout activeTab="orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Order History
          </h1>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </span>
        </div>

        {/* Orders List with Staggered Animation */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
            >
              {/* Order Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50/50 px-6 py-4">
                <div className="flex items-center gap-6">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {new Date(order.created_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="hidden items-center gap-2 text-sm text-gray-600 sm:flex">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {formatPrice(order.total, order.currency_code)}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="hidden text-xs font-mono text-gray-400 sm:inline-block">
                    #{order.display_id}
                  </span>
                </div>
              </div>

              {/* Order Items Content */}
              <div className="p-6">
                <ul className="divide-y divide-gray-50">
                  {order.items?.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        {/* Product Image */}
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                          <img
                            src={
                              item.thumbnail ||
                              "https://dummyimage.com/100x100/eee/aaa"
                            }
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            <span className="text-gray-300">•</span>
                            <span>
                              {item.variant?.title !== "Default Variant"
                                ? item.variant?.title
                                : "Standard"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Item Price */}
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.unit_price, order.currency_code)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Footer (Optional - "View Details" logic can go here later) */}
              {/* <div className="flex justify-end border-t border-gray-50 bg-white px-6 py-3">
                <button className="flex items-center text-sm font-semibold text-black hover:underline">
                  View Invoice <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div> 
              */}
            </motion.div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}

// --- HELPER COMPONENT: Status Badge ---
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
    completed: "bg-green-50 text-green-700 border-green-100",
    canceled: "bg-red-50 text-red-700 border-red-100",
    archived: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const icons = {
    pending: <Clock className="mr-1.5 h-3 w-3" />,
    completed: <Package className="mr-1.5 h-3 w-3" />,
    canceled: <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />,
    archived: <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-gray-500" />,
  };

  const currentStyle = styles[status] || styles.archived;
  const currentIcon = icons[status] || icons.archived;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${currentStyle}`}
    >
      {currentIcon}
      {status}
    </span>
  );
}
