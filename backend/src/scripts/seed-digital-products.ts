import { ExecArgs } from "@medusajs/framework/types";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function seedDigitalProducts(
  { container }: { container: any },
  args: ExecArgs,
) {
  const productService = container.resolve(Modules.PRODUCT);
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL);
  const inventoryService = container.resolve(Modules.INVENTORY);
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION);
  const pricingService = container.resolve(Modules.PRICING);
  const link = container.resolve(ContainerRegistrationKeys.LINK);

  console.log("🚀 Starting Digital Product Seeding (Nested Strategy)...");

  // 1. Get Sales Channel
  let [salesChannel] = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  });
  if (!salesChannel) {
    const channels = await salesChannelService.listSalesChannels(
      {},
      { take: 1 },
    );
    salesChannel = channels[0];
  }
  console.log(`✅ Sales Channel: ${salesChannel?.name}`);

  // 2. Get Stock Location
  const [location] = await stockLocationService.listStockLocations(
    {},
    { take: 1 },
  );
  if (!location) {
    console.error("❌ No Stock Location found.");
    return;
  }

  // 3. Setup Categories (Idempotent)
  console.log("📂 Setting up Categories...");

  let parentCat = (
    await productService.listProductCategories({ handle: "digital-codes" })
  )[0];
  if (!parentCat) {
    parentCat = await productService.createProductCategories({
      name: "گیفت کارت‌ها (Digital Codes)",
      handle: "digital-codes",
      is_active: true,
    });
  }

  let appleCat = (
    await productService.listProductCategories({ handle: "apple" })
  )[0];
  if (!appleCat) {
    appleCat = await productService.createProductCategories({
      name: "Apple",
      handle: "apple",
      parent_category_id: parentCat.id,
      is_active: true,
    });
  }

  let googleCat = (
    await productService.listProductCategories({ handle: "google" })
  )[0];
  if (!googleCat) {
    googleCat = await productService.createProductCategories({
      name: "Google Play",
      handle: "google",
      parent_category_id: parentCat.id,
      is_active: true,
    });
  }
  console.log("✅ Categories Ready.");

  // 4. Define Data Structure
  const productsData = [
    {
      title: "گیفت کارت اپل (Apple Gift Card)",
      handle: "apple-gift-card-us",
      category_id: appleCat.id,
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png",
      description: `خرید گیفت کارت اپل (Apple ID) آمریکا با تحویل آنی...`,
      tags: ["Apple", "Gift Card"],
      variantsData: [
        // Renamed to separate data from structure
        { value: "$2", price: 1_200_000 },
        { value: "$3", price: 1_800_000 },
        { value: "$5", price: 3_000_000 },
        { value: "$10", price: 6_000_000 },
        { value: "$15", price: 9_000_000 },
        { value: "$20", price: 12_000_000 },
        { value: "$25", price: 15_000_000 },
        { value: "$50", price: 30_000_000 },
        { value: "$100", price: 60_000_000 },
      ],
    },
    {
      title: "گیفت کارت گوگل پلی (Google Play)",
      handle: "google-play-card-us",
      category_id: googleCat.id,
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Google_Play_Arrow_logo.svg/800px-Google_Play_Arrow_logo.svg.png",
      description: `خرید گیفت کارت گوگل پلی استور (Google Play) ریجن آمریکا...`,
      tags: ["Google", "Android"],
      variantsData: [
        { value: "$5", price: 3_000_000 },
        { value: "$10", price: 6_000_000 },
        { value: "$15", price: 9_000_000 },
        { value: "$25", price: 15_000_000 },
        { value: "$50", price: 30_000_000 },
        { value: "$100", price: 60_000_000 },
      ],
    },
  ];

  // 5. Sync Tags
  const allTags = new Set(productsData.flatMap((p) => p.tags));
  const tagMap = new Map<string, string>();
  for (const tagName of allTags) {
    const [existing] = await productService.listProductTags({ value: tagName });
    if (existing) tagMap.set(tagName, existing.id);
    else {
      const newTag = await productService.createProductTags({ value: tagName });
      tagMap.set(tagName, newTag.id);
    }
  }

  // 6. Create Products (Nested Strategy)
  for (const p of productsData) {
    // Check if exists
    const [existing] = await productService.listProducts({ handle: p.handle });
    if (existing) {
      console.log(`Skipping existing product: ${p.handle}`);
      continue;
    }

    console.log(`Creating Product: ${p.title}...`);

    // KEY FIX: Create Product AND Variants in one call
    // This lets Medusa handle the Option Value creation logic internally
    const product = await productService.createProducts({
      title: p.title,
      description: p.description,
      handle: p.handle,
      status: "published",
      thumbnail: p.thumbnail,
      tags: p.tags.map((t) => ({ id: tagMap.get(t) })),
      sales_channels: [{ id: salesChannel.id }],
      categories: [{ id: p.category_id }],
      options: [
        { title: "Amount" }, // Define Option
      ],
      variants: p.variantsData.map((v) => ({
        title: `${v.value} Card`,
        options: { Amount: v.value }, // Map option title to value string
        // Note: Prices and Inventory must still be done post-creation in module logic
      })),
    });

    console.log(`✅ Product created with ${product.variants.length} variants.`);

    // 7. Post-Process: Add Prices & Inventory
    // We iterate the created variants to add the missing pieces
    for (const variant of product.variants) {
      // Find the original data to get the price
      // We match by the Option Value we set
      const optValue = variant.options.find(
        (o) => o.option?.title === "Amount" || o.value,
      )?.value;
      const originalData = p.variantsData.find((v) => v.value === optValue);

      if (!originalData) {
        console.warn(
          `Could not match variant ${variant.title} to source data.`,
        );
        continue;
      }

      // A. Price
      await pricingService.createPrices({
        currency_code: "irr",
        amount: originalData.price,
        rules: {},
        price_set_id: variant.price_set_id, // v2 variants have price_set_id
      });

      // B. Inventory
      const inventoryItem = await inventoryService.createInventoryItems({
        sku: `SKU-${p.handle}-${originalData.value.replace(/[^a-zA-Z0-9]/g, "")}`,
        requires_shipping: false,
      });

      await inventoryService.createInventoryLevels([
        {
          inventory_item_id: inventoryItem.id,
          location_id: location.id,
          stocked_quantity: 100,
        },
      ]);

      await link.create({
        [Modules.PRODUCT]: { variant_id: variant.id },
        [Modules.INVENTORY]: { inventory_item_id: inventoryItem.id },
      });

      console.log(
        `   -> Configured Variant: ${originalData.value} (${originalData.price.toLocaleString()} IRR)`,
      );
    }
  }

  console.log("✅ Seeding Complete!");
}
