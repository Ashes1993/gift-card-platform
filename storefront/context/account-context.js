"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AccountContext = createContext();

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export function AccountProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // --- Helper: Fetch with Token Injection ---
  async function medusaFetch(endpoint, options = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);

    // Get token from storage
    const token = localStorage.getItem("medusa_auth_token");

    const headers = {
      "Content-Type": "application/json",
      "x-publishable-api-key": API_KEY,
      ...options.headers,
    };

    // If we have a token, inject it!
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url.toString(), {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || `API Error: ${res.status}`);
      throw error;
    }

    return data;
  }

  // 1. Check Session on Startup
  useEffect(() => {
    async function checkSession() {
      const token = localStorage.getItem("medusa_auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // We use the token to fetch the customer directly
        const data = await medusaFetch("/store/customers/me");
        if (data.customer) {
          setCustomer(data.customer);
        } else {
          // Token invalid? Clear it.
          localStorage.removeItem("medusa_auth_token");
        }
      } catch (e) {
        localStorage.removeItem("medusa_auth_token");
        setCustomer(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, []);

  // 2. Login Function (Token Strategy)
  async function login(email, password) {
    try {
      // Step 1: Get Token (This works!)
      const authData = await medusaFetch("/auth/customer/emailpass", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const token = authData.token;

      if (!token) {
        throw new Error("Login failed: No token received");
      }

      // Step 2: Save Token
      localStorage.setItem("medusa_auth_token", token);

      // Step 3: Fetch Profile immediately using the new token
      // We manually add the header here because the state update (localStorage) is fast
      // but let's be safe and pass it explicitly if needed, though medusaFetch reads it.
      const profileData = await medusaFetch("/store/customers/me");

      if (profileData.customer) {
        setCustomer(profileData.customer);
        router.push("/account/profile");
      }
    } catch (e) {
      console.error("Login failed:", e);
      throw e;
    }
  }

  // 3. Register Function
  // --- New: Request OTP ---
  async function requestOtp(email) {
    return await medusaFetch("/store/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // --- New: Verify OTP (Optional check before registering) ---
  async function verifyOtp(email, otp) {
    return await medusaFetch("/store/auth/verify-register", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  // --- Updated: Register Function ---
  async function register(payload) {
    try {
      // Step 1: Create Identity
      const authData = await medusaFetch("/auth/customer/emailpass/register", {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
      });

      const token = authData.token;
      if (!token) throw new Error("No token from registration");

      // Step 2: Save Token temporarily for the next call
      localStorage.setItem("medusa_auth_token", token);

      // Step 3: Create Profile (medusaFetch will grab the token we just saved)
      const customerData = await medusaFetch("/store/customers", {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          first_name: payload.first_name,
          last_name: payload.last_name,
        }),
      });

      if (customerData.customer) {
        setCustomer(customerData.customer);
        router.push("/account/profile");
      }
    } catch (e) {
      console.error("Registration failed:", e);
      throw e;
    }
  }

  // 4. Logout Function
  // 4. Logout Function (Fixed & Cleans Cart)
  async function logout() {
    try {
      // 1. Remove Auth Token
      localStorage.removeItem("medusa_auth_token");

      // 2. Remove Cart ID (Fixes "Ghost Cart" issue)
      // This ensures the next user starts fresh.
      localStorage.removeItem("cart_id");

      // 3. Reset State
      setCustomer(null);

      // 4. Hard Redirect
      // We use window.location instead of router.push to force a full page reload.
      // This clears all React Contexts (Cart, Account) from memory immediately.
      window.location.href = "/account/login";
    } catch (e) {
      console.error("Logout failed", e);
      // Even if something fails, force the redirect
      window.location.href = "/account/login";
    }
  }

  return (
    <AccountContext.Provider
      value={{
        customer,
        isLoading,
        login,
        register,
        logout,
        requestOtp,
        verifyOtp,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export const useAccount = () => useContext(AccountContext);
