"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@/context/account-context";
import Link from "next/link";
import {
  Loader2,
  Check,
  ArrowLeft,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function RegisterForm() {
  const { requestOtp, checkUserExists, completeRegistration } = useAccount();

  // --- Form State ---
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // --- Validation State ---
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // --- UI State ---
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- OTP State ---
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  // --- Real-time Validation Logic ---
  useEffect(() => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);

    // Email
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "فرمت ایمیل صحیح نیست.";
    }

    // Password Requirements
    if (formData.password) {
      if (formData.password.length < 8) newErrors.passwordLen = true;
      if (!hasLetter || !hasNumber) newErrors.passwordComplexity = true;
    }

    // Confirm Password
    if (
      formData.confirm_password &&
      formData.password !== formData.confirm_password
    ) {
      newErrors.confirm_password = "رمز عبور مطابقت ندارد.";
    }

    setErrors(newErrors);

    // Check Global Validity
    setIsValid(
      formData.first_name &&
        formData.last_name &&
        formData.email &&
        emailRegex.test(formData.email) &&
        formData.password.length >= 8 &&
        hasLetter &&
        hasNumber &&
        formData.password === formData.confirm_password,
    );
  }, [formData]);

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  // --- Timer Logic ---
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // --- Step 1: Check Exists & Request OTP ---
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setGlobalError("");
    setIsLoading(true);

    try {
      // 1. Check if user already exists
      const exists = await checkUserExists(formData.email);
      if (exists) {
        setGlobalError("این ایمیل قبلاً ثبت‌نام شده است. لطفاً وارد شوید.");
        setIsLoading(false);
        return;
      }

      // 2. If new user, Request OTP
      const response = await requestOtp(formData.email);

      // Smart Timer
      const expiry = response?.expiresAt || Date.now() + 180000;
      const secondsRemaining = Math.floor((expiry - Date.now()) / 1000);

      setTimeLeft(secondsRemaining > 0 ? secondsRemaining : 180);
      setIsLoading(false);
      setShowOtpModal(true);
    } catch (err) {
      setGlobalError(err.message || "خطا در برقراری ارتباط با سرور.");
      setIsLoading(false);
    }
  };

  // Handle Resend
  const handleResendOtp = async () => {
    if (timeLeft > 0) return;
    setOtpError("");
    setOtpLoading(true);

    try {
      const response = await requestOtp(formData.email);
      const expiry = response?.expiresAt || Date.now() + 180000;
      const secondsRemaining = Math.floor((expiry - Date.now()) / 1000);
      setTimeLeft(secondsRemaining);
      setOtpLoading(false);
    } catch (err) {
      setOtpError(err.message || "خطا در ارسال مجدد کد.");
      setOtpLoading(false);
    }
  };

  // --- Step 2: Atomic Verification & Registration ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpLoading(true);

    try {
      // Call the atomic function (Verify + Create + Login)
      await completeRegistration({
        ...formData,
        otp: otpCode,
      });

      // If successful, the context will redirect automatically.
      // We keep loading true to prevent UI flickering during redirect.
    } catch (err) {
      setOtpError("کد وارد شده صحیح نیست یا منقضی شده است.");
      setOtpLoading(false);
    }
  };

  // Helper to render Input
  const renderInput = (name, placeholder, type = "text", showEye = false) => {
    const isError = touched[name] && errors[name];
    const isValidField = touched[name] && !errors[name] && formData[name];

    return (
      <div className="space-y-1">
        <div className="relative">
          <input
            name={name}
            type={
              showEye
                ? name === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : showConfirmPassword
                    ? "text"
                    : "password"
                : type
            }
            placeholder={placeholder}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            dir={name === "first_name" || name === "last_name" ? "rtl" : "ltr"}
            className={`block w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all
              ${
                isError
                  ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                  : isValidField
                    ? "border-green-400 bg-green-50/30 focus:border-green-500"
                    : "border-gray-200 focus:border-black focus:ring-gray-100"
              }
              ${name === "email" || type === "password" ? "text-left" : "text-right"}
            `}
          />
          {isValidField && !showEye && (
            <CheckCircle2
              className={`absolute ${name === "first_name" || name === "last_name" ? "left-3" : "right-3"} top-3 h-5 w-5 text-green-500 animate-in fade-in zoom-in`}
            />
          )}
          `
          {showEye && (
            <button
              type="button"
              onClick={() =>
                name === "password"
                  ? setShowPassword(!showPassword)
                  : setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {name === "password" ? (
                showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )
              ) : showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          )}
        </div>
        {isError && typeof errors[name] === "string" && (
          <p className="text-xs font-medium text-red-500 animate-in slide-in-from-top-1 px-1">
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`w-full max-w-md space-y-8 rounded-3xl bg-white p-8 sm:p-10 shadow-2xl border border-gray-100 transition-all duration-300 ${showOtpModal ? "blur-md opacity-50 pointer-events-none" : ""}`}
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-black text-gray-900 tracking-tight">
            ایجاد حساب کاربری
          </h2>
          <p className="mt-3 text-center text-sm text-gray-500">
            قبلاً ثبت نام کرده‌اید؟{" "}
            <Link
              href="/account/login"
              className="font-bold text-blue-600 hover:underline transition-all"
            >
              وارد شوید
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleInitialSubmit}>
          {globalError && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100 animate-in fade-in">
              <AlertCircle className="h-5 w-5 shrink-0" /> {globalError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {renderInput("first_name", "نام")}
            {renderInput("last_name", "نام خانوادگی")}
          </div>

          {renderInput("email", "name@example.com", "email")}

          {/* Password Checklist UI */}
          <div className="space-y-3 pt-2">
            {renderInput(
              "password",
              "رمز عبور (حداقل ۸ کاراکتر)",
              "password",
              true,
            )}

            <div
              className={`flex gap-3 text-[11px] px-1 transition-all duration-300 ${formData.password ? "opacity-100" : "opacity-50 grayscale"}`}
            >
              <span
                className={`flex items-center gap-1 transition-colors ${formData.password.length >= 8 ? "text-green-600 font-bold" : "text-gray-400"}`}
              >
                {formData.password.length >= 8 ? (
                  <Check size={12} />
                ) : (
                  <div className="w-1 h-1 bg-current rounded-full" />
                )}
                ۸ کاراکتر
              </span>
              <span
                className={`flex items-center gap-1 transition-colors ${/[a-zA-Z]/.test(formData.password) ? "text-green-600 font-bold" : "text-gray-400"}`}
              >
                {/[a-zA-Z]/.test(formData.password) ? (
                  <Check size={12} />
                ) : (
                  <div className="w-1 h-1 bg-current rounded-full" />
                )}
                حروف
              </span>
              <span
                className={`flex items-center gap-1 transition-colors ${/\d/.test(formData.password) ? "text-green-600 font-bold" : "text-gray-400"}`}
              >
                {/\d/.test(formData.password) ? (
                  <Check size={12} />
                ) : (
                  <div className="w-1 h-1 bg-current rounded-full" />
                )}
                اعداد
              </span>
            </div>

            {renderInput(
              "confirm_password",
              "تکرار رمز عبور",
              "password",
              true,
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="group relative flex w-full justify-center items-center rounded-xl bg-black px-4 py-4 text-sm font-bold text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" /> در حال
                پردازش...
              </>
            ) : (
              "دریافت کد تایید"
            )}
          </button>
        </form>
      </div>

      {/* --- OTP Modal --- */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowOtpModal(false)}
          ></div>
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300 scale-100">
            <div className="bg-gray-50/50 px-8 py-8 text-center border-b border-gray-100">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 border-4 border-white shadow-sm">
                <Lock className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900">تایید ایمیل</h3>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                کد ارسال شده به{" "}
                <span className="font-bold text-gray-900 dir-ltr inline-block mx-1 bg-gray-200 px-2 py-0.5 rounded-md text-xs">
                  {formData.email}
                </span>{" "}
                را وارد کنید.
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="px-8 py-8">
              <div className="mb-8">
                <input
                  type="text"
                  maxLength="6"
                  autoFocus
                  placeholder="------"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full text-center text-4xl font-mono tracking-[0.6em] py-4 border-b-2 border-gray-200 focus:border-blue-600 focus:text-blue-600 outline-none bg-transparent transition-all placeholder:tracking-widest placeholder:text-gray-200 dir-ltr font-bold"
                />
              </div>

              {otpError && (
                <div className="mb-6 text-center text-xs font-bold text-red-600 bg-red-50 py-3 rounded-xl border border-red-100 flex items-center justify-center gap-2">
                  <AlertCircle size={14} /> {otpError}
                </div>
              )}

              <button
                type="submit"
                disabled={otpLoading || otpCode.length !== 6}
                className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                {otpLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    تکمیل ثبت نام <ArrowLeft className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="mt-6 flex justify-between items-center text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpCode("");
                    setOtpLoading(false);
                  }}
                  className="text-gray-400 hover:text-gray-800 transition-colors"
                >
                  ویرایش ایمیل
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0}
                  className={`flex items-center gap-1.5 ${timeLeft > 0 ? "text-gray-400 cursor-default" : "text-blue-600 hover:text-blue-700 font-bold"}`}
                >
                  {timeLeft > 0 ? (
                    <>
                      <span className="font-mono text-sm">
                        {Math.floor(timeLeft / 60)}:
                        {(timeLeft % 60).toString().padStart(2, "0")}
                      </span>{" "}
                      تا ارسال مجدد
                    </>
                  ) : (
                    <>
                      ارسال مجدد کد <RefreshCw size={12} />
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
