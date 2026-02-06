import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const query = req.scope.resolve("query");

  console.log(`[Check-Exists] 🔍 Checking database for: ${normalizedEmail}`);

  try {
    // We explicitly look for an 'emailpass' (Password) login for this email.
    // If this returns anything, it means the user CAN already log in.
    const { data: identities } = await query.graph({
      entity: "auth_identity",
      fields: [
        "id",
        "provider_identities.entity_id",
        "provider_identities.provider",
      ],
      filters: {
        provider_identities: {
          entity_id: normalizedEmail,
          provider: "emailpass", // Strictly check for password provider
        },
      },
    });

    console.log(
      `[Check-Exists] 📊 Search Results:`,
      JSON.stringify(identities, null, 2),
    );

    const exists = identities.length > 0;

    if (exists) {
      console.log(
        `[Check-Exists] ⛔ BLOCKING: User already has a password login.`,
      );
    } else {
      console.log(
        `[Check-Exists] ✅ ALLOWING: No password login found (User might be Guest).`,
      );
    }

    return res.json({ exists });
  } catch (error) {
    console.error(`[Check-Exists] 💥 ERROR:`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
