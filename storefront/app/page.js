import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/product-card"; // Ensure filename matches exactly
import { getProducts } from "@/lib/medusa";
import { Hero } from "@/components/home/hero"; // <--- Import Client Component
import { Features } from "@/components/home/features"; // <--- Import Client Component

// Fetch products for featured section (Server Side)
async function getFeaturedProducts() {
  const { products } = (await getProducts({ limit: 4 })) || { products: [] };
  return products;
}

export default async function LandingPage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section (Client Component) */}
      <Hero />

      {/* 2. Featured Products Section (Server Data passed to Client Cards) */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tighter text-gray-900 text-center mb-12">
            Trending Gift Cards
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500">
                No featured products found. Run Medusa's seed script to populate
                products.
              </p>
            )}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/store"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition"
            >
              View All Gift Cards <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Features Section (Client Component) */}
      <Features />
    </main>
  );
}
