import { notFound } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Star, CheckCircle2 } from "lucide-react"; // Removed Zap icon
import VariantSelector from "@/components/product/variant-selector";
import ProductPurchaseCard from "@/components/product/product-purchase-card";

// Fetch logic
async function fetchProduct(handle) {
  const baseUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
  const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  try {
    const res = await fetch(
      `${baseUrl}/store/products?handle=${handle}&fields=*variants.prices,*title,*thumbnail,*description,*handle`,
      {
        headers: { "x-publishable-api-key": apiKey },
        next: { revalidate: 0 },
      },
    );
    const data = await res.json();
    return data.products?.[0];
  } catch (e) {
    return null;
  }
}

// --- Dynamic Metadata ---
export async function generateMetadata({ params }) {
  const { id: handle } = await params;
  const product = await fetchProduct(handle);

  if (!product) {
    return {
      title: "محصول یافت نشد | فروشگاه گیفت کارت",
      description: "محصول مورد نظر شما وجود ندارد.",
    };
  }

  return {
    title: `${product.title} | فروشگاه نکست لایسنس`,
    description: product.description
      ? product.description.slice(0, 160)
      : `خرید آنلاین ${product.title} با تحویل فوری.`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.thumbnail ? [product.thumbnail] : [],
      type: "website",
    },
  };
}

export default async function ProductPage({ params, searchParams }) {
  const { id: handle } = await params;
  const query = await searchParams;

  const product = await fetchProduct(handle);

  if (!product) notFound();

  // Determine Active Variant
  const sortedVariants = product.variants.sort(
    (a, b) => (a.prices?.[0]?.amount || 0) - (b.prices?.[0]?.amount || 0),
  );

  const activeVariantId = query.variant || sortedVariants[0]?.id;
  const activeVariant =
    sortedVariants.find((v) => v.id === activeVariantId) || sortedVariants[0];

  const isLocalImage =
    product.thumbnail?.includes("localhost") ||
    product.thumbnail?.includes("127.0.0.1");

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* --- LEFT: Product Visuals (lg:col-span-5) --- */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit">
            {/* OPTIMIZATION 1: Responsive Aspect Ratio 
                - Mobile: aspect-[4/3] (Shorter, fits screen better)
                - Desktop (lg): aspect-square (Big and detailed)
            */}
            <div className="relative aspect-[4/3] lg:aspect-square w-full overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm p-8 sm:p-12 flex items-center justify-center">
              {product.thumbnail && (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  unoptimized={isLocalImage}
                  // OPTIMIZATION: Reduced padding on mobile for larger image appearance
                  className="object-contain p-4 sm:p-8 transition-transform duration-700 hover:scale-105"
                  priority
                />
              )}

              {/* OPTIMIZATION 2: Removed the "Instant Delivery" (Zap) Badge */}
            </div>

            {/* Trust Badges */}
            <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-3 sm:gap-4">
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 text-center gap-2 shadow-sm">
                <ShieldCheck className="text-blue-600" size={20} />
                <span className="text-[10px] sm:text-xs font-bold text-gray-600">
                  گارانتی مادام‌العمر
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 text-center gap-2 shadow-sm">
                <Star
                  className="text-yellow-500"
                  size={20}
                  fill="currentColor"
                />
                <span className="text-[10px] sm:text-xs font-bold text-gray-600">
                  اورجینال و قانونی
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 text-center gap-2 shadow-sm">
                <CheckCircle2 className="text-green-600" size={20} />
                <span className="text-[10px] sm:text-xs font-bold text-gray-600">
                  پشتیبانی ۲۴/۷
                </span>
              </div>
            </div>
          </div>

          {/* --- RIGHT: Details & Actions (lg:col-span-7) --- */}
          <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
            {/* Header */}
            <div className="border-b border-gray-100 pb-4 sm:pb-6">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-500 font-medium">
                {activeVariant ? `${activeVariant.title}` : "انتخاب کنید"}
              </p>
            </div>

            {/* Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                مبلغ مورد نظر را انتخاب کنید:
              </label>
              <VariantSelector
                variants={sortedVariants}
                selectedVariantId={activeVariantId}
              />
            </div>

            {/* Dynamic Purchase Card */}
            <ProductPurchaseCard
              product={product}
              activeVariant={activeVariant}
            />

            {/* Description */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-black rounded-full" />
                توضیحات محصول
              </h3>
              <div className="prose prose-sm max-w-none text-gray-600 leading-loose whitespace-pre-line text-justify">
                {product.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
