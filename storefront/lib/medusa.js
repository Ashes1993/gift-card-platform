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
  if (
    !url.searchParams.has("fields") &&
    options.method !== "POST" &&
    options.method !== "DELETE"
  ) {
    // Optional: Add default fields if needed
  }

  try {
    const res = await fetch(url.toString(), {
      ...options,
      headers,
      // -------------------------------------------------------
      // FIX: Disable caching to see price updates immediately.
      // -------------------------------------------------------
      cache: "no-store",
      // If you want caching later for production, use: next: { revalidate: 3600 }
    });

    if (!res.ok) {
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
import Medusa from "@medusajs/medusa-js";
export const medusa = new Medusa({
  baseUrl: BASE_URL,
  maxRetries: 3,
  publishableApiKey: API_KEY,
});
