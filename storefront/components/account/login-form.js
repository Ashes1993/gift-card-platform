"use client";

import { useState } from "react";
import { useAccount } from "@/context/account-context";
import Link from "next/link";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const { login } = useAccount();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login(email, password);
      // Redirect handled in context
    } catch (err) {
      setError("ایمیل یا رمز عبور اشتباه است.");
      setLoading(false);
    }
  }

  return (
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
              htmlFor="email"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              آدرس ایمیل
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              // FIX: dir="ltr" ensures typing starts from left
              dir="ltr"
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-left"
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
              {/* FIX: Correct link to the forgot password page */}
              <Link
                href="/account/forgot-password"
                className="text-xs font-medium text-gray-500 hover:text-black transition-colors"
              >
                فراموشی رمز عبور؟
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                dir="ltr"
                // pl-4 pr-12 handles padding for the icon on the right
                className="block w-full rounded-lg border border-gray-300 pl-4 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-left"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full justify-center items-center rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:bg-gray-400 transition-all"
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
  );
}
