import Link from "next/link";
import { ArrowLeft } from "lucide-react"; // Switched to ArrowLeft for RTL
import ProductCard from "@/components/product/product-card";
import { getProducts } from "@/lib/medusa";

// Import Components
import { HeroCarousel } from "@/components/home/hero-carousel";
import { TrustedPartners } from "@/components/home/trusted-partners";
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { FaqSection } from "@/components/home/faq-section";
import { SeoContent } from "@/components/home/seo-content";

async function getFeaturedProducts() {
  // We disable cache here too to ensure new products appear instantly
  const { products } = (await getProducts({ limit: 4 })) || { products: [] };
  return products;
}

export default async function LandingPage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* 1. Hero Section */}
      <HeroCarousel />

      {/* 2. How It Works */}
      <HowItWorks />

      {/* 3. Trending Products Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="text-right">
              {" "}
              {/* Ensure Right Alignment */}
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                محبوب‌ترین گیفت کارت‌ها
              </h2>
              <p className="mt-2 text-gray-500 text-lg">
                پرفروش‌های هفته را از دست ندهید
              </p>
            </div>

            {/* Desktop "View All" Link */}
            <Link
              href="/store"
              className="hidden sm:flex items-center text-blue-600 font-semibold hover:text-blue-800 transition"
            >
              مشاهده همه
              {/* ArrowLeft points correctly in RTL (Next) */}
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-4 text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                محصولی یافت نشد. لطفاً دیتابیس را بررسی کنید.
              </p>
            )}
          </div>

          {/* Mobile "View All" Button */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/store"
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              مشاهده تمام محصولات
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Features (Why Choose Us) */}
      <Features />

      {/* 5. FAQ Section (SEO) */}
      <FaqSection />

      {/* 6. Trusted Partners */}
      <TrustedPartners />

      {/* 7. Rich SEO Text */}
      <SeoContent />
    </main>
  );
}
