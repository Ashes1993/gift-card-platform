"use client";

import { useState, useMemo } from "react";
import { Search, ArrowUpDown, Filter } from "lucide-react";
import VariantCard from "./variant-card";

export default function StoreView({ appleVariants, googleVariants }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default"); // 'default', 'price-asc', 'price-desc'

  // Helper to filter and sort
  const processList = (items) => {
    let result = [...items];

    // 1. Filter
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (item) =>
          item.variant.title.toLowerCase().includes(q) ||
          item.product.title.toLowerCase().includes(q) ||
          item.variant.prices?.[0]?.amount.toString().includes(q),
      );
    }

    // 2. Sort
    if (sort === "price-asc") {
      result.sort(
        (a, b) =>
          (a.variant.prices[0]?.amount || 0) -
          (b.variant.prices[0]?.amount || 0),
      );
    } else if (sort === "price-desc") {
      result.sort(
        (a, b) =>
          (b.variant.prices[0]?.amount || 0) -
          (a.variant.prices[0]?.amount || 0),
      );
    }

    return result;
  };

  const processedApple = useMemo(
    () => processList(appleVariants),
    [query, sort, appleVariants],
  );
  const processedGoogle = useMemo(
    () => processList(googleVariants),
    [query, sort, googleVariants],
  );

  const hasResults = processedApple.length > 0 || processedGoogle.length > 0;

  return (
    <div>
      {/* --- Search & Filter Bar --- */}
      <div className="sticky top-20 z-10 mb-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="جستجو در کارت‌ها (مثلا: $10 یا اپل)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-10 pl-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative min-w-[180px]">
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ArrowUpDown size={16} />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pr-10 pl-4 text-sm outline-none focus:border-black cursor-pointer"
          >
            <option value="default">پیش‌فرض</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
          </select>
        </div>
      </div>

      {/* --- Content --- */}
      {!hasResults ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Filter className="h-10 w-10 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">نتیجه‌ای یافت نشد</h3>
          <p className="text-gray-500">لطفاً عبارت جستجو را تغییر دهید.</p>
          <button
            onClick={() => {
              setQuery("");
              setSort("default");
            }}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            پاک کردن فیلترها
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Apple Section */}
          {processedApple.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-black rounded-full"></div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900">
                  گیفت کارت‌های اپل
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
                {processedApple.map((item) => (
                  <VariantCard
                    key={item.variant.id}
                    variant={item.variant}
                    parentProduct={item.product}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Google Section */}
          {processedGoogle.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900">
                  گیفت کارت‌های گوگل پلی
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
                {processedGoogle.map((item) => (
                  <VariantCard
                    key={item.variant.id}
                    variant={item.variant}
                    parentProduct={item.product}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
