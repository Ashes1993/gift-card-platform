"use client";

import { useCart } from "@/context/cart-context";

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  // 1. Defensively find the price
  const price = product.variants?.[0]?.prices?.[0];
  const variantId = product.variants?.[0]?.id;

  const priceDisplay = price
    ? `${(price.amount / 100).toFixed(2)} ${price.currency_code.toUpperCase()}`
    : "Unavailable";

  return (
    <div className="group relative block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.thumbnail || "https://dummyimage.com/400x400/eee/aaa"}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {priceDisplay}
          </span>
          <button
            onClick={() => addToCart(variantId)}
            className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-gray-800 active:scale-95"
            disabled={!variantId}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
