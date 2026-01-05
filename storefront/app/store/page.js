import ProductCard from "@/components/product/product-card";
import { getProducts } from "@/lib/medusa";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  // AWAIT the searchParams (Next.js 15 requirement)
  const params = await searchParams;

  const { products } = (await getProducts({
    q: params.q || "",
  })) || { products: [] };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          خرید انواع گیفت کارت
        </h1>
        <span className="text-sm text-gray-500">
          نمایش {products.length} محصول
        </span>
      </div>

      {/* Filter / Search Placeholder */}
      <div className="mb-8 p-4 border border-gray-200 rounded-xl bg-gray-50/50 flex items-center gap-3 text-gray-500">
        <Search className="h-5 w-5 opacity-50" />
        <p className="text-sm">
          <span className="font-bold">به زودی:</span> قابلیت جستجو بر اساس برند،
          فیلتر قیمت و دسته‌بندی اضافه خواهد شد.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500">محصولی یافت نشد.</p>
        </div>
      )}
    </div>
  );
}
