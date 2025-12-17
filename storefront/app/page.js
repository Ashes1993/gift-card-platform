import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import { getProducts } from "@/lib/medusa";

// Import Components
import { HeroCarousel } from "@/components/home/hero-carousel";
import { TrustedPartners } from "@/components/home/trusted-partners"; // <--- New Name
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { FaqSection } from "@/components/home/faq-section"; // <--- SEO
import { SeoContent } from "@/components/home/seo-content"; // <--- SEO

async function getFeaturedProducts() {
  // We disable cache here too to ensure new products appear instantly
  const { products } = (await getProducts({ limit: 4 })) || { products: [] };
  return products;
}

export default async function LandingPage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero */}
      <HeroCarousel />

      {/* 2. How It Works (Moved Up for better UX) */}
      <HowItWorks />

      {/* 3. Trending Products */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Trending Gift Cards
              </h2>
              <p className="mt-2 text-gray-500">Popular picks this week</p>
            </div>
            <Link
              href="/store"
              className="hidden sm:flex items-center text-blue-600 font-semibold hover:text-blue-800 transition"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-4 text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                No featured products found. Run Medusa's seed script to populate
                products.
              </p>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/store" className="btn-secondary w-full justify-center">
              View All Gift Cards
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Features (Why Choose Us) */}
      <Features />

      {/* 5. FAQ Section (SEO) */}
      <FaqSection />

      {/* 6. Trusted Partners (Moved Down as requested) */}
      <TrustedPartners />

      {/* 7. Rich SEO Text (Bottom) */}
      <SeoContent />
    </main>
  );
}
