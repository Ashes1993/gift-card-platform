import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, otp, password, first_name, last_name } = req.body as any;

  if (!email || !otp || !password) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const store = (global as any).otpStore;

  // --- 1. OTP VERIFICATION ---
  if (!store || !store[normalizedEmail]) {
    return res.status(400).json({ message: "کد تایید منقضی شده است." });
  }

  const record = store[normalizedEmail];

  if (Date.now() > record.expiresAt) {
    delete store[normalizedEmail];
    return res.status(401).json({ message: "کد منقضی شده است." });
  }

  if (record.code !== otp) {
    return res.status(401).json({ message: "کد وارد شده صحیح نیست." });
  }

  try {
    const authModuleService = req.scope.resolve(Modules.AUTH);
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER);

    // --- 2. GET/CREATE CUSTOMER PROFILE ---
    let customer;
    const existingCustomers = await customerModuleService.listCustomers({
      email: normalizedEmail,
    });

    if (existingCustomers.length > 0) {
      console.log(`[Auth] ℹ️ Linking to existing Guest/Customer profile...`);
      customer = existingCustomers[0];

      if (first_name || last_name) {
        await customerModuleService.updateCustomers(customer.id, {
          first_name: first_name || customer.first_name,
          last_name: last_name || customer.last_name,
        });
      }
    } else {
      customer = await customerModuleService.createCustomers({
        email: normalizedEmail,
        first_name,
        last_name,
      });
    }

    // --- 3. REGISTER VIA AUTH MODULE ---
    const authResponse = await authModuleService.register("emailpass", {
      body: {
        email: normalizedEmail,
        password: password,
      },
    });

    if (!authResponse.success) {
      throw new Error(authResponse.error || "Registration failed internally");
    }

    const authIdentity = authResponse.authIdentity;

    if (!authIdentity) {
      throw new Error("Registration succeeded but no Identity returned.");
    }

    // --- 4. LINK AUTH TO CUSTOMER ---
    await authModuleService.updateAuthIdentities([
      {
        id: authIdentity.id,
        app_metadata: {
          customer_id: customer.id,
        },
      },
    ]);

    // --- 5. UPDATE CUSTOMER STATUS (FIXED) ---
    // We cast to 'any' to bypass the missing type definition for 'has_account'
    await customerModuleService.updateCustomers(customer.id, {
      has_account: true,
    } as any);

    // --- 6. CLEANUP ---
    delete store[normalizedEmail];
    console.log(`[Auth] 🚀 User Registered & Verified successfully.`);

    return res.json({
      success: true,
      message: "Registration complete",
      customer,
    });
  } catch (error: any) {
    console.error("[Auth] Registration Error:", error);

    if (
      error.message?.includes("exists") ||
      error.message?.includes("identity")
    ) {
      return res.status(409).json({
        message: "این حساب کاربری قبلاً فعال شده است. لطفاً وارد شوید.",
      });
    }

    return res.status(500).json({
      message: "خطا در ساخت حساب کاربری.",
      details: error.message,
    });
  }
}
