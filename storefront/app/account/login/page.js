"use client";

import { useState } from "react";
import { useAccount } from "@/context/account-context";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAccount();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login(email, password);
      // Redirect is handled in context
    } catch (err) {
      setError("ایمیل یا رمز عبور اشتباه است.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 sm:p-10 shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            ورود به حساب کاربری
          </h2>
          <p className="mt-3 text-center text-sm text-gray-600">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/account/register"
              className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-all"
            >
              ثبت نام کنید
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                آدرس ایمیل
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-left dir-ltr"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-gray-700"
                >
                  رمز عبور
                </label>
                <Link
                  href="#"
                  className="text-xs font-medium text-gray-500 hover:text-black"
                >
                  فراموشی رمز عبور؟
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-left dir-ltr"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center items-center rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" /> در حال ورود...
              </>
            ) : (
              "ورود"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
