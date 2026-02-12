import Medusa from "@medusajs/medusa-js";

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

// --- 0. The Sanitizer (Fixes Database "localhost" Errors) ---
/**
 * Recursively walks through the data object.
 * If it finds a string containing 'http://localhost:9000',
 * it replaces it with the correct Production BASE_URL.
 */
function fixLocalhostUrls(data) {
  if (!data) return data;

  // 1. If it's a string, check and fix
  if (typeof data === "string") {
    if (data.includes("http://localhost:9000")) {
      return data.replace("http://localhost:9000", BASE_URL);
    }
    return data;
  }

  // 2. If it's an array, fix every item
  if (Array.isArray(data)) {
    return data.map(fixLocalhostUrls);
  }

  // 3. If it's an object, fix every value (recursive)
  if (typeof data === "object") {
    const newData = {};
    Object.keys(data).forEach((key) => {
      newData[key] = fixLocalhostUrls(data[key]);
    });
    return newData;
  }

  return data;
}

// --- 1. Server-Side Fetcher (Next.js Friendly) ---
/**
 * Generic fetcher for Medusa Store API using Native Fetch
 * Used primarily in Server Components to control Next.js Caching
 */
async function medusaFetch(endpoint, options = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);

  const headers = {
    "Content-Type": "application/json",
    "x-publishable-api-key": API_KEY,
    ...options.headers,
  };

  try {
    const res = await fetch(url.toString(), {
      ...options,
      headers,
      // CRITICAL: Disable Next.js caching to ensure live pricing/stock
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Medusa API Error: ${res.status} ${res.statusText}`);
    }

    const body = await res.json();

    // INTERCEPTION: Clean the data before returning it to the app
    return fixLocalhostUrls(body);
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    return null;
  }
}

// --- 2. Data Access Functions (Server Side) ---

export async function getProducts(query = {}) {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.limit) params.set("limit", query.limit);
  if (query.offset) params.set("offset", query.offset);

  // V2/V1 Compat: Request fields to ensure images/prices are present
  params.set(
    "fields",
    "*variants.prices,*title,*thumbnail,*description,*handle",
  );

  const data = await medusaFetch(`/store/products?${params.toString()}`);
  return data || { products: [] };
}

export async function getProductByHandle(handle) {
  const params = new URLSearchParams();
  params.set("handle", handle);
  params.set(
    "fields",
    "*variants.prices,*title,*thumbnail,*description,*handle,*options",
  );

  const data = await medusaFetch(`/store/products?${params.toString()}`);
  return data?.products?.[0] || null;
}

// --- 3. Client-Side SDK (For Cart Context) ---
// We export this specifically for use in "use client" components like the Cart.
export const medusa = new Medusa({
  baseUrl: BASE_URL,
  maxRetries: 3,
  publishableApiKey: API_KEY,
});
