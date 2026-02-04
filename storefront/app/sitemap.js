// storefront/src/app/sitemap.js

// 1. Define your Base URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://nextlicense.shop";

// 2. Helper to fetch products from Medusa
async function getProducts() {
  try {
    // We use the internal backend URL if available, otherwise public
    const backendUrl =
      process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";

    const res = await fetch(`${backendUrl}/store/products?limit=1000`, {
      next: { revalidate: 3600 }, // Re-check for new products every hour
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    return data.products;
  } catch (error) {
    console.error("Sitemap Error:", error);
    return [];
  }
}

export default async function sitemap() {
  // Fetch dynamic data
  const products = await getProducts();

  // 3. Define Static Routes
  const staticRoutes = [
    "",
    "/store",
    "/account/login",
    "/account/register",
    "/support", // Assuming you have a support page
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 4. Define Product Routes
  const productRoutes = products.map((product) => ({
    url: `${BASE_URL}/products/${product.handle}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly",
    priority: 0.9, // High priority for products
  }));

  // 5. Combine and Return
  return [...staticRoutes, ...productRoutes];
}
