"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatPrice, getVariantPrice } from "@/lib/utils";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProductCard({ product }) {
  const { cart } = useCart();

  // 1. Determine Currency (Default to USD if cart isn't ready)
  const currencyCode = cart?.region?.currency_code || "usd";

  // 2. Get the correct price for this currency
  const displayVariant = product.variants?.[0];
  const priceAmount = getVariantPrice(displayVariant, currencyCode);

  const formattedPrice = formatPrice(priceAmount, currencyCode);

  const linkPath = `/product/${product.handle || product.id}`;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-200"
    >
      <Link href={linkPath}>
        <div className="aspect-h-3 aspect-w-4 overflow-hidden bg-gray-100 relative">
          <img
            src={
              product.thumbnail ||
              "https://placehold.co/600x450/4f46e5/white?text=GiftCard"
            }
            alt={product.title}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-4 text-right">
          {" "}
          {/* Ensure text-right for RTL */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {product.subtitle || product.description?.substring(0, 50) + "..."}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-black text-blue-600">{formattedPrice}</p>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              تحویل آنی
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
