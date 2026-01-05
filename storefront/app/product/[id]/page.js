import { notFound } from "next/navigation";
import { ProductActions } from "@/components/product/product-actions";
import { ProductPriceDisplay } from "@/components/product/product-price-display";

// Utility function to fetch product data
async function getProduct(handle) {
  const baseUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
  const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  const url = new URL(`${baseUrl}/store/products`);
  url.searchParams.append("handle", handle);
  // Important: Fetch prices to allow filtering later
  url.searchParams.append(
    "fields",
    "*variants.prices,*title,*thumbnail,*description,*handle"
  );

  try {
    const res = await fetch(url.toString(), {
      headers: { "x-publishable-api-key": apiKey },
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.products?.[0] || null;
  } catch (error) {
    return null;
  }
}

export default async function ProductPage({ params }) {
  // Await params for Next.js 15
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* RTL Grid: In RTL mode, the first column (Image) will be on the Right, Info on Left. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        {/* Product Image */}
        <div className="flex flex-col-reverse">
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            <img
              src={
                product.thumbnail || "https://dummyimage.com/600x600/eee/aaa"
              }
              alt={product.title}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 text-right">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            {product.title}
          </h1>

          <div className="mt-4">
            <h2 className="sr-only">قیمت محصول</h2>
            <ProductPriceDisplay product={product} />
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-900">توضیحات محصول</h3>
            <div className="mt-4 space-y-6 text-base text-gray-600 leading-relaxed">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Features List (Static for now, implies trust) */}
          <div className="mt-8 border-t border-gray-100 pt-8">
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                ✅ تحویل آنی و خودکار به ایمیل
              </li>
              <li className="flex items-center gap-2">
                ✅ گارانتی مادام‌العمر و اورجینال
              </li>
              <li className="flex items-center gap-2">✅ پشتیبانی ۲۴ ساعته</li>
            </ul>
          </div>

          {/* Add to Cart Section */}
          <div className="mt-10 pt-6">
            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
