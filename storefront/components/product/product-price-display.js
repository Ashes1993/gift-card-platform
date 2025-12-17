"use client";

import { useCart } from "@/context/cart-context";
import { formatPrice, getVariantPrice } from "@/lib/utils";

export function ProductPriceDisplay({ product }) {
  const { cart } = useCart();
  const currencyCode = cart?.region?.currency_code || "usd";

  const displayVariant = product.variants?.[0];
  const priceAmount = getVariantPrice(displayVariant, currencyCode);

  return (
    <p className="text-3xl tracking-tight text-gray-900">
      {formatPrice(priceAmount, currencyCode)}
    </p>
  );
}
