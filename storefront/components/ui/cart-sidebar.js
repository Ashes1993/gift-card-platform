"use client";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowLeft } from "lucide-react";

export function CartSidebar() {
  const { cart, isOpen, setIsOpen, removeItem, updateItem } = useCart();

  // Robust fallback
  const currencyCode = cart?.region?.currency_code?.toUpperCase() || "USD";

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const subtotal =
    cart?.subtotal ||
    cart?.items?.reduce((acc, item) => {
      return acc + item.unit_price * item.quantity;
    }, 0) ||
    0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="relative z-100">
          {/* 1. Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* 2. Slide Panel (RTL: Slide from LEFT) */}
          <motion.div
            initial={{ x: "-100%" }} // Start off-screen LEFT
            animate={{ x: 0 }} // Slide to visible
            exit={{ x: "-100%" }} // Exit back to LEFT
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                سبد خرید{" "}
                <span className="text-gray-400 font-normal dir-ltr">
                  ({itemCount})
                </span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-6">
                {cart?.items?.map((item) => (
                  <motion.li layout key={item.id} className="flex gap-4">
                    {/* Image */}
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 relative">
                      <img
                        src={
                          item.thumbnail ||
                          "https://dummyimage.com/100x100/eee/aaa"
                        }
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-bold text-gray-900 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-sm font-bold text-blue-600 whitespace-nowrap">
                            {formatPrice(
                              item.unit_price * item.quantity,
                              currencyCode
                            )}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.variant?.title !== "Default Variant"
                            ? item.variant?.title
                            : "نسخه دیجیتال"}
                        </p>
                      </div>

                      {/* Controls Footer */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100">
                          <button
                            onClick={() =>
                              updateItem(item.id, item.quantity + 1)
                            }
                            className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-500 hover:text-black transition-all"
                          >
                            <Plus size={14} />
                          </button>

                          <span className="text-sm font-semibold w-6 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateItem(item.id, item.quantity - 1);
                              } else {
                                removeItem(item.id);
                              }
                            }}
                            className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-500 hover:text-black transition-all"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 size={14} className="text-red-500" />
                            ) : (
                              <Minus size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}

                {(!cart?.items || cart.items.length === 0) && (
                  <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
                    <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        سبد خرید خالی است
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        شما هنوز محصولی اضافه نکرده‌اید.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="mt-4 rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:bg-gray-800"
                    >
                      شروع خرید
                    </button>
                  </div>
                )}
              </ul>
            </div>

            {/* Footer */}
            {itemCount > 0 && (
              <div className="border-t border-gray-100 bg-white px-6 py-6 pb-8 safe-area-bottom">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                  <p>جمع کل</p>
                  <p className="font-bold text-xl text-blue-600">
                    {formatPrice(subtotal, currencyCode)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mb-6 text-right">
                  مالیات و هزینه خدمات در مرحله پرداخت محاسبه می‌شود.
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-black px-6 py-4 text-base font-bold text-white shadow-lg hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  تسویه حساب <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
