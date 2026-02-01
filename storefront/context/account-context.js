"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

const AccountContext = createContext();

const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export function AccountProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  // Default to TRUE so we don't show "Sign In" button while actually checking
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // --- 1. Stable Fetch Function ---
  const medusaFetch = useCallback(async (endpoint, options = {}) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const token = localStorage.getItem("medusa_auth_token");

    const headers = {
      "Content-Type": "application/json",
      "x-publishable-api-key": API_KEY,
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url.toString(), { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      // Auto-Logout on 401 (Unauthorized) to prevent broken states
      if (res.status === 401 && endpoint !== "/auth/customer/emailpass") {
        localStorage.removeItem("medusa_auth_token");
        setCustomer(null);
      }
      throw new Error(data.message || `API Error: ${res.status}`);
    }

    return data;
  }, []);

  // --- 2. Check Session on Mount ---
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("medusa_auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await medusaFetch("/store/customers/me");
        if (data.customer) {
          setCustomer(data.customer);
        }
      } catch (e) {
        console.error("Session check failed", e);
        setCustomer(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [medusaFetch]);

  // --- 3. Login Action ---
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const authData = await medusaFetch("/auth/customer/emailpass", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (authData.token) {
        localStorage.setItem("medusa_auth_token", authData.token);

        // Fetch Profile
        const profileData = await medusaFetch("/store/customers/me");
        setCustomer(profileData.customer);

        // Refresh the page or trigger Cart Refresh here if CartContext exposes it
        // window.location.reload(); // Bruteforce sync (optional)
        router.push("/account/profile");
      }
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. Register Action ---
  const register = async (payload) => {
    setIsLoading(true);
    try {
      // Register
      const authData = await medusaFetch("/auth/customer/emailpass/register", {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
      });

      if (authData.token) {
        localStorage.setItem("medusa_auth_token", authData.token);

        // Create Profile
        const customerData = await medusaFetch("/store/customers", {
          method: "POST",
          body: JSON.stringify({
            email: payload.email,
            first_name: payload.first_name,
            last_name: payload.last_name,
          }),
        });

        setCustomer(customerData.customer);
        router.push("/account/profile");
      }
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // --- 5. OTP Helpers ---
  const requestOtp = async (email) => {
    return await medusaFetch("/store/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  const verifyOtp = async (email, otp) => {
    return await medusaFetch("/store/auth/verify-register", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  };

  // --- 6. Logout ---
  const logout = () => {
    localStorage.removeItem("medusa_auth_token");
    localStorage.removeItem("cart_id"); // Clear cart association
    setCustomer(null);
    window.location.href = "/account/login"; // Hard refresh to clear all states
  };

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
        medusaFetch,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export const useAccount = () => useContext(AccountContext);
