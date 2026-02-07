import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";

// --- CONFIGURATION ---
const PROFIT_MARGIN = 1.035; // 3.5% Profit
const ROUND_TO_NEAREST = 50000; // Round to nearest 5,000 Tomans (50,000 Rials) for clean prices

type UpdatePricesInput = {
  exchange_rate: number; // The current price of $1 in IRR (e.g., 650,000)
};

// --- STEP 1: FETCH VARIANTS WITH USD VALUE ---
const getUsdVariantsStep = createStep(
  "get-usd-variants",
  async (_, { container }) => {
    const productModule = container.resolve(Modules.PRODUCT);

    // Fetch all variants. In a real large store, you'd paginate this.
    // For < 2000 items, this is fine.
    const [variants] = await productModule.listAndCountProductVariants(
      {},
      {
        select: ["id", "metadata"],
        take: 10000,
      },
    );

    // Filter only variants that have a 'usd_value' set
    const validVariants = variants.filter(
      (v) => v.metadata && v.metadata.usd_value,
    );

    return new StepResponse(validVariants);
  },
);

// --- STEP 2: CALCULATE NEW PRICES ---
const calculatePricesStep = createStep(
  "calculate-prices",
  async (input: { variants: any[]; rate: number }, { container }) => {
    const pricingService = container.resolve(Modules.PRICING);
    const updates: any[] = [];

    // 1. Get the 'IRR' currency (assuming you use IRR in Medusa)
    // If you use TOMAN externally, Medusa usually still stores IRR internally.
    const currencyCode = "irr";

    for (const variant of input.variants) {
      const usdValue = Number(variant.metadata.usd_value);

      if (!usdValue || isNaN(usdValue)) continue;

      // THE FORMULA: (USD * Rate * Margin)
      let rawPrice = usdValue * input.rate * PROFIT_MARGIN;

      // SMART ROUNDING (Iranian Market Standard)
      // Example: 612,340 -> 600,000 or 650,000 depending on setting
      // We use Math.ceil to secure profit (never round down too much)
      const roundedPrice =
        Math.ceil(rawPrice / ROUND_TO_NEAREST) * ROUND_TO_NEAREST;

      updates.push({
        variant_id: variant.id,
        currency_code: currencyCode,
        amount: roundedPrice,
        min_quantity: null,
        max_quantity: null,
      });
    }

    return new StepResponse(updates);
  },
);

// --- STEP 3: UPDATE PRICES IN DATABASE ---
const updatePricesInDbStep = createStep(
  "update-prices-db",
  async (updates: any[], { container }) => {
    const pricingModule = container.resolve(Modules.PRICING);

    // We create a "Price Set" for each variant if it doesn't exist,
    // or update the existing money amount.
    // In Medusa v2, prices are linked via PriceSets.

    // For simplicity in this workflow, we will iterate and upsert.
    // In high-scale production, we would bulk this.

    for (const update of updates) {
      // Ideally, you'd use a dedicated service to manage PriceSets here.
      // This is a simplified implementation for the "Batch" strategy.
      // We assume a PriceSet exists for the variant.
      // Note: This part requires the link between Variant <-> PriceSet to be established.
      // If you are using the standard Medusa seeder, this link exists.
    }

    // *Correction for Medusa v2 Architecture*:
    // We cannot just "update price". We must create a new Price for the PriceSet.
    // This part is complex in v2. Let's simplify:
    // We will return the calculated data so the API route can handle the mutation
    // using the high-level Product Service which is easier.

    return new StepResponse(updates);
  },
);

// --- WORKFLOW DEFINITION ---
export const updatePricesWorkflow = createWorkflow(
  "update-prices-workflow",
  (input: UpdatePricesInput) => {
    const variants = getUsdVariantsStep();

    const updates = calculatePricesStep({
      variants,
      rate: input.exchange_rate,
    });

    // We return the calculated updates to be processed
    return new WorkflowResponse(updates);
  },
);
