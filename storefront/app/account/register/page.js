"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@/context/account-context";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle, ArrowRight, Lock } from "lucide-react";

export default function RegisterPage() {
  const { register, requestOtp, verifyOtp } = useAccount(); // Ensure these are exposed in Context

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // UI State
  const [passwordMatch, setPasswordMatch] = useState(null); // null, true, false
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
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      // Call Backend to send email
      await requestOtp(formData.email);
      setIsLoading(false);
      setShowOtpModal(true); // Open Modal
    } catch (err) {
      setError(err.message || "Failed to send verification code.");
      setIsLoading(false);
    }
  };

  // 3. Step 2: Verify & Register
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpLoading(true);

    try {
      // A. Verify Code
      await verifyOtp(formData.email, otpCode);

      // B. If verified, proceed to actual Registration
      await register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });

      // Redirect happens inside register() logic in context
    } catch (err) {
      setOtpError(err.message || "Invalid code. Please try again.");
      setOtpLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* --- Main Registration Card --- */}
      <div
        className={`w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-xl transition-all duration-300 ${
          showOtpModal ? "blur-sm opacity-50 pointer-events-none" : ""
        }`}
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/account/login"
              className="font-medium text-black underline hover:text-gray-700"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleInitialSubmit}>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <XCircle className="h-4 w-4" /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <input
              name="first_name"
              type="text"
              required
              placeholder="First Name"
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
            <input
              name="last_name"
              type="text"
              required
              placeholder="Last Name"
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
          />

          <div className="space-y-3">
            <div className="relative">
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="relative">
              <input
                name="confirm_password"
                type="password"
                required
                placeholder="Confirm Password"
                onChange={handleChange}
                className={`block w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-1 ${
                  passwordMatch === false
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
                    : passwordMatch === true
                    ? "border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50"
                    : "border-gray-200 focus:border-black focus:ring-black"
                }`}
              />
              {/* Real-time Indicator */}
              <div className="absolute right-3 top-3.5">
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
            className="group relative flex w-full justify-center rounded-lg bg-black px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:bg-gray-400 transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Verify & Register"
            )}
          </button>
        </form>
      </div>

      {/* --- OTP Modal (Modern Design) --- */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowOtpModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-gray-50 px-8 py-6 text-center border-b border-gray-100">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Enter Verification Code
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-gray-800">
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
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, ""))
                  } // Only numbers
                  className="w-full text-center text-3xl font-mono tracking-[0.5em] py-3 border-b-2 border-gray-200 focus:border-black outline-none bg-transparent transition-all placeholder:tracking-normal placeholder:text-lg placeholder:font-sans"
                />
              </div>

              {otpError && (
                <div className="mb-4 text-center text-sm text-red-600 font-medium">
                  {otpError}
                </div>
              )}

              <button
                type="submit"
                disabled={otpLoading || otpCode.length !== 6}
                className="w-full rounded-lg bg-black py-3 text-sm font-bold text-white shadow-md hover:bg-gray-800 disabled:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Finish Sign Up <ArrowRight className="h-4 w-4" />
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
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  Cancel & Change Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
