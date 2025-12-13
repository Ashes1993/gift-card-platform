import ProductCard from "@/components/ui/product-card";
import { getProducts } from "@/lib/medusa";

export default async function ProductsPage({ searchParams }) {
  // Pass filter parameters (if present) to the getProducts API call
  const { products } = (await getProducts({
    q: searchParams.q || "",
    // Add other filter parameters here later (e.g., category_id: searchParams.category)
  })) || { products: [] };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Shop All Gift Cards
      </h1>

      {/* Search and Filter Section Placeholder (Item 4) */}
      <div className="mb-8 p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
        <p className="text-sm text-gray-500">
          **Future Scope:** Search by brand, filter by price and category.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
