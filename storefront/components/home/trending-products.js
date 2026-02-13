import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TrendingGrid from "./trending-grid";

// Base URL for Server Component
const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

// 1. Fetch Data (Server-Side)
async function getTrendingItems() {
  if (!API_KEY) {
    console.error(
      "❌ ERROR: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is missing in .env!",
    );
    return [];
  }

  try {
    const url = `${BASE_URL}/store/products?fields=*variants,*variants.prices,*title,*thumbnail,*handle&limit=4`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": API_KEY,
      },
      // Revalidate every hour to keep the homepage fast and static-friendly
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(
        `❌ Trending Products Fetch Failed: ${res.status} ${res.statusText}`,
        errText,
      );
      return [];
    }

    const data = await res.json();
    const trendingItems = [];

    (data.products || []).forEach((product) => {
      // Inline URL cleaner for absolute safety
      let cleanThumbnail = product.thumbnail;
      if (cleanThumbnail && cleanThumbnail.includes("http://localhost:9000")) {
        cleanThumbnail = cleanThumbnail.replace(
          "http://localhost:9000",
          "https://nextlicense.shop",
        );
      }

      const topVariants = product.variants?.slice(0, 2) || [];

      topVariants.forEach((variant) => {
        const prices = variant.prices || [];
        const irrPrice = prices.find((p) => p.currency_code === "irr");
        const usdPrice = prices.find((p) => p.currency_code === "usd");

        const displayPrice = irrPrice || usdPrice;

        if (displayPrice) {
          trendingItems.push({
            id: variant.id,
            handle: product.handle,
            title: product.title,
            variantTitle: variant.title,
            thumbnail: cleanThumbnail,
            price: displayPrice.amount,
            currency: displayPrice.currency_code,
          });
        }
      });
    });

    return trendingItems.slice(0, 4);
  } catch (error) {
    console.error("❌ Trending Network Error:", error);
    return [];
  }
}

export default async function TrendingProducts() {
  // Fetch on Server
  const items = await getTrendingItems();

  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">
              محبوب‌ترین گیفت کارت‌ها
            </h2>
            <p className="mt-2 text-lg text-gray-500">
              پرفروش‌های هفته را از دست ندهید
            </p>
          </div>

          <Link
            href="/store"
            className="hidden sm:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors group"
          >
            مشاهده همه
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Pass items to the Client Component for Animation */}
        <TrendingGrid items={items} />

        {/* Mobile "View All" Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/store"
            className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-4 text-base font-bold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            مشاهده تمام محصولات
          </Link>
        </div>
      </div>
    </section>
  );
}
