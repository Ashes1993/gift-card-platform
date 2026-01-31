"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

export default function VariantSelector({ variants, selectedVariantId }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (variantId) => {
    const params = new URLSearchParams(searchParams);
    params.set("variant", variantId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {variants.map((variant) => {
        const label = variant.title
          .replace(" Card", "")
          .replace("Gift Card", "")
          .trim();
        const isSelected = variant.id === selectedVariantId;

        return (
          <button
            key={variant.id}
            onClick={() => handleSelect(variant.id)}
            className={`relative flex items-center justify-center py-3 px-2 rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? "border-black bg-black text-white shadow-lg scale-105"
                : "border-gray-100 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span className="font-bold dir-ltr">{label}</span>
            {isSelected && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5 border-2 border-white">
                <Check size={10} strokeWidth={4} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
