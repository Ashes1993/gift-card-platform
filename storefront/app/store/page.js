import { getProducts } from "@/lib/medusa";
import StoreView from "@/components/product/store-view";

// 1. Metadata for SEO
export const metadata = {
  title: "فروشگاه نکست لایسنس | خرید گیفت کارت اپل و گوگل پلی",
  description:
    "خرید انواع گیفت کارت اورجینال اپل (Apple Gift Card) و گوگل پلی (Google Play) با تحویل آنی و قیمت مناسب.",
  keywords: [
    "گیفت کارت",
    "خرید گیفت کارت",
    "گیفت کارت اپل",
    "گیفت کارت گوگل",
    "تحویل آنی",
  ],
  openGraph: {
    title: "فروشگاه نکست لایسنس - تحویل سریع",
    description: "خرید انواع گیفت کارت اورجینال با قیمت مناسب",
    type: "website",
  },
};

// 2. Caching Strategy
// "force-dynamic" avoids stale price bugs, ensuring users always see the latest IRR price.
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  // Fetch all products (limit: 100 to be safe, we filter manually)
  const { products } = (await getProducts({ limit: 100 })) || { products: [] };

  // 3. Data Flattening & Categorization
  // We need to transform "Products" into "Variant Items"
  const appleVariants = [];
  const googleVariants = [];

  products.forEach((product) => {
    // Check tags/categories to decide grouping
    const isApple =
      product.tags?.some((t) => t.value.toLowerCase().includes("apple")) ||
      product.title.toLowerCase().includes("apple");
    const isGoogle =
      product.tags?.some((t) => t.value.toLowerCase().includes("google")) ||
      product.title.toLowerCase().includes("google");

    if (product.variants) {
      product.variants.forEach((variant) => {
        // Create a lightweight object for the card
        const variantItem = {
          variant: variant,
          product: {
            title: product.title,
            thumbnail: product.thumbnail,
            handle: product.handle, // Used for linking
          },
        };

        if (isApple) appleVariants.push(variantItem);
        else if (isGoogle) googleVariants.push(variantItem);
      });
    }
  });

  // Sort them by price (Cheapest first) as default server-side order
  const sortByPrice = (a, b) =>
    (a.variant.prices?.[0]?.amount || 0) - (b.variant.prices?.[0]?.amount || 0);
  appleVariants.sort(sortByPrice);
  googleVariants.sort(sortByPrice);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
          فروشگاه گیفت کارت
        </h1>
        <p className="max-w-xl mx-auto text-gray-500">
          تمامی کارت‌ها اورجینال بوده و کد آن‌ها به صورت آنی پس از پرداخت به
          ایمیل شما ارسال می‌شود.
        </p>
      </div>

      {/* Client Side View (Filters & Grids) */}
      <StoreView
        appleVariants={appleVariants}
        googleVariants={googleVariants}
      />
    </div>
  );
}
