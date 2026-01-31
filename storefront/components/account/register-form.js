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
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

export default function RegisterForm() {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Timer State
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Request OTP
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setPasswordMatch(false);
      setError("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }

    if (formData.password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setIsLoading(true);

    try {
      // Assuming requestOtp returns { success: true, expiresAt: timestamp }
      const response = await requestOtp(formData.email);

      // Calculate remaining time based on server expiry or default to 60s
      const seconds = response?.expiresAt
        ? Math.floor((response.expiresAt - Date.now()) / 1000)
        : 60;

      setTimeLeft(seconds > 0 ? seconds : 60);
      setIsLoading(false);
      setShowOtpModal(true);
    } catch (err) {
      setError(err.message || "خطا در ارسال کد تایید.");
      setIsLoading(false);
    }
  };

  // Handle Resend
  const handleResendOtp = async () => {
    if (timeLeft > 0) return;

    setOtpError("");
    setOtpLoading(true); // Show loading briefly on the text

    try {
      const response = await requestOtp(formData.email);
      const seconds = response?.expiresAt
        ? Math.floor((response.expiresAt - Date.now()) / 1000)
        : 60;
      setTimeLeft(seconds > 0 ? seconds : 60);
      setOtpLoading(false);
    } catch (err) {
      setOtpError(err.message || "خطا در ارسال مجدد کد.");
      setOtpLoading(false);
    }
  };

  // Step 2: Verify & Register
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
      setOtpError("کد وارد شده صحیح نیست یا منقضی شده است.");
      setOtpLoading(false);
    }
  };

  return (
    <>
      <div
        className={`w-full max-w-md space-y-8 rounded-2xl bg-white p-8 sm:p-10 shadow-xl border border-gray-100 transition-all duration-300 ${showOtpModal ? "blur-sm opacity-50 pointer-events-none" : ""}`}
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
            <input
              name="first_name"
              type="text"
              required
              placeholder="نام"
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400"
            />
            <input
              name="last_name"
              type="text"
              required
              placeholder="نام خانوادگی"
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400"
            />
          </div>

          <input
            name="email"
            type="email"
            required
            dir="ltr"
            placeholder="name@example.com"
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 text-left"
          />

          <div className="space-y-3">
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                dir="ltr"
                placeholder="رمز عبور"
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 pl-4 pr-12 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 text-left"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                required
                dir="ltr"
                placeholder="تکرار رمز عبور"
                onChange={handleChange}
                className={`block w-full rounded-lg border pl-4 pr-12 py-3 text-sm outline-none focus:ring-1 placeholder-gray-400 text-left transition-colors ${passwordMatch === false ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50" : "border-gray-300 focus:border-black focus:ring-black"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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

      {/* --- OTP Modal --- */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowOtpModal(false)}
          ></div>
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-gray-50 px-8 py-6 text-center border-b border-gray-100">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 border-4 border-white shadow-sm">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">
                تایید ایمیل
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                کد ۶ رقمی ارسال شده به{" "}
                <span className="font-bold text-gray-800 dir-ltr inline-block mx-1">
                  {formData.email}
                </span>{" "}
                را وارد کنید.
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

              <div className="mt-6 flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpCode("");
                  }}
                  className="text-gray-400 hover:text-gray-600 underline"
                >
                  ویرایش ایمیل
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0}
                  className={`flex items-center gap-1 ${timeLeft > 0 ? "text-gray-400 cursor-default" : "text-blue-600 hover:text-blue-700 font-bold"}`}
                >
                  {timeLeft > 0 ? (
                    <>
                      <span>{timeLeft}</span> ثانیه تا ارسال مجدد
                    </>
                  ) : (
                    <>
                      ارسال مجدد کد <RefreshCw size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
