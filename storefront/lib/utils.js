import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// 1. FORMATTER: Turns numbers into strings (e.g. 1000 -> "۱۰,۰۰۰ ریال")
export function formatPrice(amount, currencyCode) {
  if (amount === null || amount === undefined) return "N/A";
  if (!currencyCode) return amount.toString();

  const code = currencyCode.toUpperCase();

  // Define Zero-Decimal Currencies
  // IRR (Rial) strictly has no decimals in common usage
  const zeroDecimalCurrencies = ["IRR", "JPY", "KRW", "VND", "CLP"];
  const isZeroDecimal = zeroDecimalCurrencies.includes(code);

  // Calculate value: USD needs division by 100, IRR does not.
  const value = isZeroDecimal ? amount : amount / 100;

  // Determine Locale: Use Persian for IRR, English for USD/EUR
  const locale = code === "IRR" ? "fa-IR" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  }).format(value);
}

// 2. SELECTOR: Finds the correct price amount from a Product Variant
export function getVariantPrice(variant, currencyCode = "usd") {
  if (!variant || !variant.prices || variant.prices.length === 0) {
    return 0;
  }

  // A. Try to find the price matching the user's currency
  const priceObj = variant.prices.find(
    (p) => p.currency_code?.toLowerCase() === currencyCode?.toLowerCase()
  );

  // B. If found, return it.
  if (priceObj) {
    return priceObj.amount;
  }

  // C. Fallback: If we can't find specific currency price, return the first one
  return variant.prices[0]?.amount || 0;
}
