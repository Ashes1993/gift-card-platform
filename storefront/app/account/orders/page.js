"use client";

import { useEffect, useState } from "react";
import { listOrders } from "./actions";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import AccountLayout from "@/components/account/account-layout";
import { motion } from "framer-motion";
import {
  Loader2,
  Calendar,
  CreditCard,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 10;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const token = localStorage.getItem("medusa_auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const result = await listOrders(token, page, LIMIT);
      if (result.success) {
        setOrders(result.orders);
        setTotalCount(result.count);
      }
      setLoading(false);
    };

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadData();
  }, [page]);

  // --- LOADING STATE ---
  if (loading && orders.length === 0) {
    return (
      <AccountLayout activeTab="orders">
        <div className="flex h-[400px] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
        </div>
      </AccountLayout>
    );
  }

  // --- EMPTY STATE ---
  if (!loading && orders.length === 0) {
    return (
      <AccountLayout activeTab="orders">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 py-24 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100 mb-6">
            <ShoppingBag className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            هنوز سفارشی ثبت نکرده‌اید
          </h3>
          <Link
            href="/store"
            className="mt-8 rounded-xl bg-black px-8 py-4 text-sm font-bold text-white transition-all hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1"
          >
            شروع اولین خرید
          </Link>
        </motion.div>
      </AccountLayout>
    );
  }

  // --- MAIN LIST STATE ---
  const totalPages = Math.ceil(totalCount / LIMIT);

  return (
    <AccountLayout activeTab="orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            تاریخچه سفارشات
          </h1>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {totalCount} سفارش
          </span>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            // Skeleton Loader for page transitions
            <div className="flex h-64 w-full items-center justify-center opacity-50">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          ) : (
            orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50/40 px-6 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-6">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {new Date(order.created_at).toLocaleDateString(
                          "fa-IR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
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
                    {/* LOGIC FIX: Pass fulfillment_status instead of generic status */}
                    <StatusBadge
                      status={order.status}
                      fulfillmentStatus={order.fulfillment_status}
                    />
                    <span className="hidden text-xs font-mono text-gray-400 sm:inline-block dir-ltr">
                      #{order.display_id}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <ul className="divide-y divide-gray-50">
                    {order.items?.map((item) => {
                      // METADATA STRATEGY: Get the "$10" label
                      const variantLabel =
                        item.metadata?.title ||
                        item.variant?.title
                          ?.replace("Gift Card", "")
                          .replace("Card", "")
                          .trim();

                      const isLocal = item.thumbnail?.includes("localhost");

                      return (
                        <li
                          key={item.id}
                          className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-4">
                            {/* Product Image Fix */}
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                              <Image
                                src={
                                  item.thumbnail ||
                                  "https://dummyimage.com/100x100/eee/aaa"
                                }
                                alt={item.title}
                                fill
                                unoptimized={isLocal} // Fix for local dev
                                className="object-contain p-1.5" // Prevents zoom/crop
                              />
                            </div>

                            {/* Product Info */}
                            <div>
                              <p className="font-bold text-gray-900 text-sm sm:text-base">
                                {item.title}
                              </p>
                              <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                                <span>تعداد: {item.quantity}</span>
                                <span className="text-gray-300">•</span>
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-medium">
                                  {variantLabel &&
                                  variantLabel !== "Default Variant"
                                    ? variantLabel
                                    : "نسخه دیجیتال"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Item Price */}
                          <p className="font-bold text-gray-900 text-sm sm:text-base dir-ltr">
                            {formatPrice(item.unit_price, order.currency_code)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />{" "}
              {/* RTL: Right is Previous */}
              صفحه قبل
            </button>

            <span className="text-sm font-medium text-gray-900">
              صفحه {page} از {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              صفحه بعد
              <ChevronLeft className="h-4 w-4" /> {/* RTL: Left is Next */}
            </button>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

// --- HELPER: Intelligent Status Badge ---
function StatusBadge({ status, fulfillmentStatus }) {
  // Logic:
  // 1. If canceled -> Red "Canceled"
  // 2. If fulfillment is "shipped" or "fulfilled" -> Green "Processed" (Completed)
  // 3. Otherwise (paid but not shipped) -> Yellow "Pending" (In Progress)

  let badgeConfig = {
    label: "در انتظار بررسی",
    style: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: <Clock className="ml-1.5 h-3.5 w-3.5" />,
  };

  if (status === "canceled") {
    badgeConfig = {
      label: "لغو شده",
      style: "bg-red-50 text-red-700 border-red-200",
      icon: <PackageCheck className="ml-1.5 h-3.5 w-3.5" />,
    };
  } else if (
    fulfillmentStatus === "shipped" ||
    fulfillmentStatus === "fulfilled"
  ) {
    badgeConfig = {
      label: "تکمیل شده", // "Processed"
      style: "bg-green-50 text-green-700 border-green-200",
      icon: <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" />,
    };
  }

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${badgeConfig.style}`}
    >
      {badgeConfig.icon}
      {badgeConfig.label}
    </span>
  );
}
