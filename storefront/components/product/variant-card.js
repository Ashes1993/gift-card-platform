import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function VariantCard({ variant, parentProduct }) {
  const priceObj = variant.prices?.find((p) => p.currency_code === "irr");
  const price = priceObj ? priceObj.amount : 0;
  const formattedPrice = new Intl.NumberFormat("fa-IR").format(price);
  const amountLabel = variant.title
    .replace(" Card", "")
    .replace("Gift Card", "")
    .trim();

  // FIX: Check local image for dev environment
  const isLocalImage =
    parentProduct.thumbnail?.includes("localhost") ||
    parentProduct.thumbnail?.includes("127.0.0.1");

  return (
    <Link
      href={`/product/${parentProduct.handle}?variant=${variant.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-black/10 transition-all duration-300 h-full"
    >
      {/* Image Container - optimized sizing */}
      <div className="relative aspect-[1.6] bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        {parentProduct.thumbnail && (
          <div className="relative w-full h-full">
            <Image
              src={parentProduct.thumbnail}
              alt={amountLabel}
              fill
              unoptimized={isLocalImage}
              className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Badge (Price Label) */}
        <div className="absolute top-4 left-4 bg-black/5 backdrop-blur-md px-3 py-1 rounded-full border border-black/5">
          <span className="font-black tracking-tighter dir-ltr text-gray-900">
            {amountLabel}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between border-t border-gray-50 bg-white">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">قیمت نهایی</span>
          <span className="font-bold text-gray-900">
            {formattedPrice}{" "}
            <span className="text-[10px] text-gray-500 font-normal">ریال</span>
          </span>
        </div>
        <div className="h-8 w-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
          <ArrowLeft size={16} />
        </div>
      </div>
    </Link>
  );
}
