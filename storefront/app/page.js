import { getProducts } from "@/lib/medusa";

// Import Components
import { HeroCarousel } from "@/components/home/hero-carousel";

import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { FaqSection } from "@/components/home/faq-section";
import { SeoContent } from "@/components/home/seo-content";
import TrendingProducts from "@/components/home/trending-products";

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
      <TrendingProducts />

      {/* 4. Features (Why Choose Us) */}
      <Features />

      {/* 5. FAQ Section (SEO) */}
      <FaqSection />

      {/* 6. Rich SEO Text */}
      <SeoContent />
    </main>
  );
}
