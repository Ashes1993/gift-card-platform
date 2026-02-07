import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { updatePricesWorkflow } from "../../../workflows/update-prices";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";

// DEFINE A SECRET KEY FOR YOURSELF
const MY_SECRET_KEY = "my_super_secure_password_123";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // 1. SECURITY CHECK
  const secret = req.headers["x-my-secret-key"];
  if (secret !== MY_SECRET_KEY) {
    return res.status(401).json({ message: "Unauthorized: Wrong Secret Key" });
  }

  // 2. Validate Input
  const { rate } = req.body as { rate: number };
  if (!rate || isNaN(rate)) {
    return res.status(400).json({
      message: "Please provide a valid 'rate' (e.g., 650000).",
    });
  }

  // 3. Run Calculation Workflow
  const { result: priceUpdates } = await updatePricesWorkflow(req.scope).run({
    input: { exchange_rate: rate },
  });

  if (!priceUpdates || priceUpdates.length === 0) {
    return res.json({
      success: true,
      message: "No variants with 'usd_value' found. No prices updated.",
    });
  }

  // 4. Perform Updates
  const pricingModule = req.scope.resolve(Modules.PRICING);
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  let updatedCount = 0;
  const errors: any[] = [];

  for (const update of priceUpdates) {
    try {
      // Fetch Variant + PriceSet ID
      const { data: variants } = await query.graph({
        entity: "product_variant",
        fields: ["id", "price_set.id"],
        filters: {
          id: update.variant_id,
        },
      });

      const variant = variants[0];

      if (variant && variant.price_set && variant.price_set.id) {
        // FIX: Use 'createPrices' with a single array argument.
        // The 'price_set_id' must be inside the object.
        await (pricingModule as any).createPrices([
          {
            price_set_id: variant.price_set.id, // <--- MOVED INSIDE
            currency_code: "irr",
            amount: update.amount,
            min_quantity: null,
            max_quantity: null,
            rules: {},
          },
        ]);
        updatedCount++;
      } else {
        errors.push(
          `Variant ${update.variant_id} found, but has no linked Price Set.`,
        );
      }
    } catch (err: any) {
      console.error(`Failed to update variant ${update.variant_id}:`, err);
      errors.push(err.message);
    }
  }

  return res.json({
    success: true,
    message: `Successfully updated prices for ${updatedCount} products.`,
    rate_used: rate,
    profit_margin: "3.5%",
    debug_errors: errors.length > 0 ? errors : undefined,
    example_calculation: {
      usd: 10,
      rate: rate,
      formula: `(${rate} * 10 * 1.035)`,
      final_irr: priceUpdates[0]?.amount || 0,
    },
  });
}
