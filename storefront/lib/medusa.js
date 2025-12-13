const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

/**
 * Generic fetcher for Medusa Store API
 */
async function medusaFetch(endpoint, options = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);

  const headers = {
    "Content-Type": "application/json",
    "x-publishable-api-key": API_KEY,
    ...options.headers,
  };

  // V2 requires 'fields' for most GET requests to return relations
  // We append a default set if none is provided in the URL
  if (
    !url.searchParams.has("fields") &&
    options.method !== "POST" &&
    options.method !== "DELETE"
  ) {
    // Default fields often needed
    // url.searchParams.append("fields", "*variants,*variants.prices")
    // Note: It's safer to let the specific functions handle fields,
    // but this is a fallback if needed.
  }

  try {
    const res = await fetch(url.toString(), {
      ...options,
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour by default
    });

    if (!res.ok) {
      // Allow 404s to be handled by the caller
      if (res.status === 404) return null;
      throw new Error(`Medusa API Error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    return null;
  }
}

/**
 * Fetch a list of products
 * @param {Object} query - Query parameters (limit, offset, q, etc.)
 */
export async function getProducts(query = {}) {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.limit) params.set("limit", query.limit);
  if (query.offset) params.set("offset", query.offset);

  // V2: Must request specific fields to get images and prices
  params.set(
    "fields",
    "*variants.prices,*title,*thumbnail,*description,*handle"
  );

  const data = await medusaFetch(`/store/products?${params.toString()}`);
  return data || { products: [] };
}

/**
 * Fetch a single product by handle
 */
export async function getProductByHandle(handle) {
  const params = new URLSearchParams();
  params.set("handle", handle);
  params.set(
    "fields",
    "*variants.prices,*title,*thumbnail,*description,*handle,*options"
  );

  const data = await medusaFetch(`/store/products?${params.toString()}`);
  return data?.products?.[0] || null;
}

// Keep the V1 client ONLY if you absolutely need it for the cart context
// (though we should eventually replace that too).
// For now, we export it to prevent breaking the Cart Context if it still imports 'medusa'.
import Medusa from "@medusajs/medusa-js";
export const medusa = new Medusa({
  baseUrl: BASE_URL,
  maxRetries: 3,
  publishableApiKey: API_KEY,
});
