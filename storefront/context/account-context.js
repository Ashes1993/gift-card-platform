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
        const profileData = await medusaFetch("/store/customers/me");
        setCustomer(profileData.customer);
        router.push("/account/profile");
      }
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. NEW: Check User Existence ---
  const checkUserExists = async (email) => {
    try {
      const data = await medusaFetch("/store/auth/check-exists", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return data.exists; // Returns true/false
    } catch (error) {
      console.error("Check user failed:", error);
      return false; // Fail safe
    }
  };

  // --- 5. NEW: Complete Registration (Atomic) ---
  // This replaces the old verifyOtp AND register functions
  const completeRegistration = async (payload) => {
    setIsLoading(true);
    try {
      // 1. Verify OTP & Create Account (Backend does both now)
      await medusaFetch("/store/auth/verify-register", {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          otp: payload.otp, // The code user entered
          password: payload.password,
          first_name: payload.first_name,
          last_name: payload.last_name,
        }),
      });

      // 2. Auto Login after success
      // Since verify-register creates the user, we can immediately log them in
      await login(payload.email, payload.password);
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // --- 6. Helpers ---
  const requestOtp = async (email) => {
    return await medusaFetch("/store/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  const logout = () => {
    localStorage.removeItem("medusa_auth_token");
    localStorage.removeItem("cart_id");
    setCustomer(null);
    window.location.href = "/account/login";
  };

  return (
    <AccountContext.Provider
      value={{
        customer,
        isLoading,
        login,
        checkUserExists, // Exposed
        completeRegistration, // Exposed
        requestOtp,
        logout,
        medusaFetch,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export const useAccount = () => useContext(AccountContext);
