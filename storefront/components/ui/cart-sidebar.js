"use client";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils"; // <--- Import utility
import { motion, AnimatePresence } from "framer-motion"; // <--- Import animation library
import Link from "next/link";
import { X, Trash2, ShoppingBag } from "lucide-react";

export function CartSidebar() {
  const { cart, isOpen, setIsOpen, removeItem } = useCart();

  // Safely get currency code (fallback to EUR if missing)
  const currencyCode = cart?.region?.currency_code?.toUpperCase() || "EUR";
  const itemCount = cart?.items?.length || 0;

  // Calculate Subtotal safely (handle V2 structure)
  // Sometimes subtotal is at cart.subtotal, sometimes we calc it manually
  const subtotal =
    cart?.subtotal ||
    cart?.items?.reduce((acc, item) => {
      return acc + item.unit_price * item.quantity;
    }, 0) ||
    0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="relative z-50">
          {/* 1. Dark Overlay (Fade In/Out) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* 2. Sliding Panel (Slide In/Out) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shopping Cart ({itemCount})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="space-y-6">
                {cart?.items?.map((item) => (
                  <motion.li layout key={item.id} className="flex py-2">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <img
                        src={
                          item.thumbnail ||
                          "https://dummyimage.com/100x100/eee/aaa"
                        }
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="line-clamp-1">{item.title}</h3>
                          <p className="ml-4">
                            {/* FIX: Use formatPrice utility */}
                            {formatPrice(item.unit_price, currencyCode)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {item.variant?.title !== "Default Variant"
                            ? item.variant?.title
                            : ""}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1">
                          <span className="text-xs text-gray-500">Qty:</span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 font-medium text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="text-xs">Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}

                {itemCount === 0 && (
                  <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                    <ShoppingBag className="h-16 w-16 text-gray-200" />
                    <p className="text-gray-500">Your cart is empty.</p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-semibold text-black hover:underline"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </ul>
            </div>

            {/* Footer */}
            {itemCount > 0 && (
              <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>
                    {/* FIX: Use formatPrice for Subtotal too */}
                    {formatPrice(subtotal, currencyCode)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6">
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-full bg-black px-6 py-4 text-base font-bold text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
