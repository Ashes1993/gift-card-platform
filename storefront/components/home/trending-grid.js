"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Tag } from "lucide-react";

// Animation Variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each item
    },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Helper to format price
const formatPrice = (amount, currencyCode) => {
  if (!amount && amount !== 0) return "ناموجود";
  return new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function TrendingGrid({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="col-span-4 flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">محصولی برای نمایش یافت نشد.</p>
        <p className="text-xs text-gray-400 mt-2">
          لطفاً ترمینال را برای خطا بررسی کنید.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      // FIX: Changed mobile to 2 columns (grid-cols-2) and reduced the mobile gap (gap-3)
      className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemAnim}>
          <Link
            href={`/product/${item.handle}?variant=${item.id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:border-blue-100 hover:-translate-y-1"
          >
            {/* Image Section */}
            {/* FIX: aspect-square on mobile makes it compact, aspect-[4/3] on desktop */}
            <div className="relative aspect-square sm:aspect-[4/3] bg-gray-50 overflow-hidden">
              <Image
                src={item.thumbnail || "https://dummyimage.com/400x400/eee/aaa"}
                alt={item.title}
                fill
                // FIX: Reduced padding on mobile (p-3), restored on desktop (sm:p-6)
                className="object-contain p-3 sm:p-6 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
            </div>

            {/* Content Section */}
            {/* FIX: Reduced padding on mobile (p-3), restored on desktop (sm:p-5) */}
            <div className="flex flex-1 flex-col p-3 sm:p-5">
              <div className="mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500" />
                <span className="text-[10px] sm:text-xs font-medium text-blue-500 line-clamp-1">
                  {item.title}
                </span>
              </div>

              {/* FIX: Smaller title on mobile */}
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                {item.variantTitle}
              </h3>

              <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between border-t border-gray-50">
                <div className="flex flex-col">
                  {/* FIX: Smaller price on mobile */}
                  <span className="text-sm sm:text-lg font-black text-gray-900">
                    {formatPrice(item.price, item.currency)}
                  </span>
                </div>

                {/* FIX: Smaller button and icon on mobile */}
                <div className="flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <ShoppingBag className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
