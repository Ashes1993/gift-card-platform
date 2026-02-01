"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Loader2, ShoppingBag } from "lucide-react";

export default function ProductPurchaseCard({ product, activeVariant }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Price formatting
  const priceObj = activeVariant?.prices?.find(
    (p) => p.currency_code === "irr",
  );
  const price = priceObj ? priceObj.amount : 0;
  const formattedPrice = new Intl.NumberFormat("fa-IR").format(price);

  const handleAddToCart = async () => {
    if (!activeVariant) return;
    setLoading(true);

    // 1. Generate clean label (e.g., "$10")
    // We try to grab the option value first, fallback to title cleaning
    let cleanLabel = activeVariant.options?.[0]?.value;

    if (!cleanLabel) {
      cleanLabel = activeVariant.title
        .replace("Gift Card", "")
        .replace("Card", "")
        .trim();
    }

    try {
      // 2. Pass label as Metadata
      await addToCart(activeVariant.id, 1, {
        title: cleanLabel, // This is what the Cart Sidebar will display
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl shadow-gray-200">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm mb-1">قیمت قابل پرداخت</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight">
              {formattedPrice}
            </span>
            <span className="text-sm font-normal text-gray-400">ریال</span>
          </div>
        </div>

        {/* SKU Badge */}
        <div className="hidden sm:block bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">
          <span className="text-xs font-mono text-gray-300 tracking-wider">
            {activeVariant?.options?.[0]?.value || "DIGITAL"}
          </span>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={loading || !activeVariant}
        className="w-full h-14 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <ShoppingBag size={20} strokeWidth={2.5} />
            افزودن به سبد خرید
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        با خرید این محصول، قوانین و مقررات فروشگاه را می‌پذیرید.
      </p>
    </div>
  );
}
