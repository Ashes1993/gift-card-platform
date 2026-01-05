"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@/context/account-context";
import Link from "next/link";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Lock,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const { register, requestOtp, verifyOtp } = useAccount();

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // UI State
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  // 1. Real-time Password Checking
  useEffect(() => {
    if (formData.confirm_password) {
      setPasswordMatch(formData.password === formData.confirm_password);
    } else {
      setPasswordMatch(null);
    }
  }, [formData.password, formData.confirm_password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Step 1: Request OTP
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordMatch) {
      setError("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }

    if (formData.password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setIsLoading(true);

    try {
      await requestOtp(formData.email);
      setIsLoading(false);
      setShowOtpModal(true);
    } catch (err) {
      setError(err.message || "خطا در ارسال کد تایید.");
      setIsLoading(false);
    }
  };

  // 3. Step 2: Verify & Register
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpLoading(true);

    try {
      await verifyOtp(formData.email, otpCode);

      await register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      setOtpError("کد وارد شده صحیح نیست. مجددا تلاش کنید.");
      setOtpLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* --- Main Registration Card --- */}
      <div
        className={`w-full max-w-md space-y-8 rounded-2xl bg-white p-8 sm:p-10 shadow-xl border border-gray-100 transition-all duration-300 ${
          showOtpModal ? "blur-sm opacity-50 pointer-events-none" : ""
        }`}
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            ایجاد حساب کاربری
          </h2>
          <p className="mt-3 text-center text-sm text-gray-600">
            قبلاً ثبت نام کرده‌اید؟{" "}
            <Link
              href="/account/login"
              className="font-bold text-black underline hover:text-gray-700 transition-all"
            >
              وارد شوید
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleInitialSubmit}>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                نام
              </label>
              <input
                name="first_name"
                type="text"
                required
                placeholder="علی"
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                نام خانوادگی
              </label>
              <input
                name="last_name"
                type="text"
                required
                placeholder="محمدی"
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              ایمیل
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 text-left dir-ltr"
            />
          </div>

          <div className="space-y-3">
            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                رمز عبور
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 text-left dir-ltr"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                تکرار رمز عبور
              </label>
              <input
                name="confirm_password"
                type="password"
                required
                placeholder="••••••••"
                onChange={handleChange}
                className={`block w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-1 placeholder-gray-400 text-left dir-ltr transition-colors ${
                  passwordMatch === false
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
                    : passwordMatch === true
                    ? "border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50"
                    : "border-gray-300 focus:border-black focus:ring-black"
                }`}
              />
              {/* Real-time Indicator (positioned left for LTR input in RTL layout) */}
              <div className="absolute left-3 top-9">
                {passwordMatch === true && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {passwordMatch === false && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center items-center rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:bg-gray-400 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" /> در حال ارسال
                کد...
              </>
            ) : (
              "ثبت نام و دریافت کد تایید"
            )}
          </button>
        </form>
      </div>

      {/* --- OTP Modal (Modern Design) --- */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowOtpModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-gray-50 px-8 py-6 text-center border-b border-gray-100">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 border-4 border-white shadow-sm">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">
                تایید ایمیل
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                کد ۶ رقمی ارسال شده به ایمیل زیر را وارد کنید:
                <br />
                <span className="font-bold text-gray-800 dir-ltr inline-block mt-1">
                  {formData.email}
                </span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="px-8 py-8">
              <div className="mb-6">
                <input
                  type="text"
                  maxLength="6"
                  autoFocus
                  placeholder="------"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full text-center text-4xl font-mono tracking-[0.5em] py-4 border-b-2 border-gray-200 focus:border-black outline-none bg-transparent transition-all placeholder:tracking-normal placeholder:text-gray-300 dir-ltr"
                />
              </div>

              {otpError && (
                <div className="mb-6 text-center text-sm text-red-600 font-bold bg-red-50 py-2 rounded-lg">
                  {otpError}
                </div>
              )}

              <button
                type="submit"
                disabled={otpLoading || otpCode.length !== 6}
                className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white shadow-md hover:bg-gray-800 disabled:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    تکمیل ثبت نام <ArrowLeft className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpCode("");
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                >
                  ویرایش ایمیل / انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
