"use client";

import { useState, useEffect } from "react";
import { requestOtpAction, resetPasswordAction } from "./actions";
import Link from "next/link";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // --- States ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  // --- Effects ---

  // 1. Check Password Match Real-time
  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(null);
    }
  }, [password, confirmPassword]);

  // 2. Timer Logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // --- Handlers ---

  // Step 1: Request OTP & Open Modal
  async function handleInitialSubmit(e) {
    e.preventDefault();
    setError("");

    if (!passwordMatch) {
      setError("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }

    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setLoading(true);

    // Call Action
    const res = await requestOtpAction(email);
    setLoading(false);

    if (res.success) {
      // Start Timer
      const seconds = res.expiresAt
        ? Math.floor((res.expiresAt - Date.now()) / 1000)
        : 60;
      setTimeLeft(seconds > 0 ? seconds : 60);

      // Open Modal
      setShowOtpModal(true);
    } else {
      setError(res.error || "خطا در ارسال کد تایید.");
    }
  }

  // Step 2: Resend Code
  async function handleResend() {
    if (timeLeft > 0) return;
    setOtpError("");
    setOtpLoading(true); // Small loading indicator on button text

    const res = await requestOtpAction(email);
    setOtpLoading(false);

    if (res.success) {
      const seconds = res.expiresAt
        ? Math.floor((res.expiresAt - Date.now()) / 1000)
        : 60;
      setTimeLeft(seconds > 0 ? seconds : 60);
    } else {
      setOtpError(res.error || "خطا در ارسال مجدد.");
    }
  }

  // Step 3: Verify OTP & Change Password
  async function handleFinalSubmit(e) {
    e.preventDefault();
    setOtpError("");
    setOtpLoading(true);

    const res = await resetPasswordAction(email, otp, password);
    setOtpLoading(false);

    if (res.success) {
      setShowOtpModal(false);
      setSuccess(true);
      setTimeout(() => router.push("/account/login"), 3000);
    } else {
      setOtpError(res.error || "کد وارد شده صحیح نیست.");
    }
  }

  // --- Render ---

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100 text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            رمز عبور تغییر کرد
          </h2>
          <p className="text-gray-500">
            شما می‌توانید اکنون با رمز عبور جدید وارد شوید.
          </p>
          <Link
            href="/account/login"
            className="block w-full rounded-xl bg-black py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all"
          >
            ورود به حساب
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      {/* Main Form */}
      <div
        className={`w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100 transition-all duration-300 ${showOtpModal ? "blur-sm opacity-50 pointer-events-none" : ""}`}
      >
        <form onSubmit={handleInitialSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-gray-900">
              بازیابی رمز عبور
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              ایمیل و رمز عبور جدید خود را وارد کنید.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center font-medium border border-red-100">
              {error}
            </p>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ایمیل
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-left focus:border-black focus:ring-1 focus:ring-black outline-none placeholder-gray-400"
                placeholder="name@example.com"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                رمز عبور جدید
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  className="block w-full rounded-lg border border-gray-300 pl-4 pr-12 py-3 text-left focus:border-black focus:ring-1 focus:ring-black outline-none placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                تکرار رمز عبور
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  dir="ltr"
                  className={`block w-full rounded-lg border pl-4 pr-12 py-3 text-left outline-none focus:ring-1 placeholder-gray-400 transition-colors ${
                    passwordMatch === false
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
                      : passwordMatch === true
                        ? "border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50"
                        : "border-gray-300 focus:border-black focus:ring-black"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {/* Match Indicator */}
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
            disabled={loading}
            className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white flex justify-center items-center shadow-md hover:bg-gray-800 transition-all disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin ml-2 h-5 w-5" /> در حال
                پردازش...
              </>
            ) : (
              "دریافت کد تایید و تغییر رمز"
            )}
          </button>

          <div className="text-center">
            <Link
              href="/account/login"
              className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              بازگشت به ورود
            </Link>
          </div>
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
                  {email}
                </span>{" "}
                را وارد کنید.
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} className="px-8 py-8">
              <div className="mb-6">
                <input
                  type="text"
                  maxLength="6"
                  autoFocus
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
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
                disabled={otpLoading || otp.length !== 6}
                className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white shadow-md hover:bg-gray-800 disabled:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    تایید و تغییر رمز <ArrowLeft className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="mt-6 flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="text-gray-400 hover:text-gray-600 underline"
                >
                  ویرایش اطلاعات
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timeLeft > 0}
                  className={`flex items-center gap-1 ${
                    timeLeft > 0
                      ? "text-gray-400 cursor-default"
                      : "text-blue-600 hover:text-blue-700 font-bold"
                  }`}
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
    </div>
  );
}
