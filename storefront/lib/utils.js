export function formatPrice(amount, currencyCode) {
  if (!amount && amount !== 0) return "0";
  if (!currencyCode) return amount.toString();

  const code = currencyCode.toUpperCase();

  // 1. Define Zero-Decimal Currencies
  // These currencies (IRR, JPY, KRW, etc.) should NOT be divided by 100.
  const zeroDecimalCurrencies = ["IRR", "JPY", "KRW", "VND", "CLP"];

  const isZeroDecimal = zeroDecimalCurrencies.includes(code);

  // 2. Calculate correct value
  // If it's NOT a zero-decimal currency (like USD), we divide by 100.
  // If it IS IRR, we use the raw amount directly.
  const value = isZeroDecimal ? amount : amount / 100;

  // 3. Format with Intl.NumberFormat
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: isZeroDecimal ? 0 : 2, // No decimals for IRR
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  }).format(value);
}
