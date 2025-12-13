// storefront/components/ui/productCard.js

"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

// Add Framer Motion wrapper
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProductCard({ product }) {
  const price = product.variants?.[0].prices?.[0];
  const formattedPrice = price
    ? formatPrice(price.amount, price.currency_code)
    : "N/A";

  const linkPath = `/product/${product.handle || product.id}`;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <Link href={linkPath}>
        <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-t-lg bg-gray-200">
          <img
            src={
              product.thumbnail ||
              "https://placehold.co/600x450/4f46e5/white?text=GiftCard"
            }
            alt={product.title}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:opacity-75"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.subtitle || product.description?.substring(0, 50) + "..."}
          </p>
          <p className="text-xl font-semibold text-blue-600 mt-2">
            {formattedPrice}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
