import { medusa } from "@/lib/medusa";
import { ProductCard } from "@/components/ui/product-card";

export default async function Home() {
  // 1. Fetch products from Medusa Backend
  // This runs on the server, so it's fast and SEO friendly.
  const { products } = await medusa.products.list();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Gift Card Store
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Purchase digital gift cards instantly.
          </p>
        </header>

        {/* 2. The Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No products found. (Did you seed the database?)
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
