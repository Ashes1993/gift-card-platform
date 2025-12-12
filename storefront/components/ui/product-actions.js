"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";

export function ProductActions({ product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Get the first variant ID (since we don't have a variant selector yet)
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
      className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
