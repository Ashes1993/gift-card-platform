"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Loader2, ShoppingCart } from "lucide-react";

export function ProductActions({ product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Get the first variant ID
  const variantId = product.variants?.[0]?.id;

  async function handleAddToCart() {
    if (!variantId) return;

    setIsAdding(true);
    await addToCart(variantId);

    // Simulate a small delay for better UX
    setTimeout(() => setIsAdding(false), 500);
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || !variantId}
      className="flex w-full items-center justify-center rounded-xl border border-transparent bg-blue-600 px-8 py-4 text-base font-bold text-white hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 transition-all"
    >
      {isAdding ? (
        <>
          <Loader2 className="animate-spin ml-2 h-5 w-5" /> در حال افزودن...
        </>
      ) : (
        <>
          افزودن به سبد خرید <ShoppingCart className="mr-2 h-5 w-5" />
        </>
      )}
    </button>
  );
}
