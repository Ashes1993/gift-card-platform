import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ui/product-card";
import { ProductActions } from "@/components/ui/product-actions";
import { formatPrice } from "@/lib/utils"; // <--- 1. Import the utility

// Utility function to fetch product data using Native Fetch (Medusa v2 compatible)
async function getProduct(handle) {
  const baseUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
  const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  const url = new URL(`${baseUrl}/store/products`);
  url.searchParams.append("handle", handle);

  url.searchParams.append(
    "fields",
    "*variants.prices,*title,*thumbnail,*description,*handle"
  );

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "x-publishable-api-key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("Medusa API Error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.products?.[0] || null;
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // --- Product Display ---
  const firstVariant = product.variants?.[0];
  const priceObj = firstVariant?.prices?.[0];

  // FIX 2: Use formatPrice instead of manual division
  // This ensures IRR is treated as a zero-decimal currency
  const priceDisplay = priceObj
    ? formatPrice(priceObj.amount, priceObj.currency_code)
    : "Price Unavailable";

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Product Image */}
        <div className="flex flex-col-reverse">
          <div className="aspect-h-1 aspect-w-1 w-full">
            <img
              src={
                product.thumbnail || "https://dummyimage.com/600x600/eee/aaa"
              }
              alt={product.title}
              className="h-full w-full object-cover object-center rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {product.title}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              {priceDisplay}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base text-gray-700">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="mt-10 border-t border-gray-200 pt-10">
            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
