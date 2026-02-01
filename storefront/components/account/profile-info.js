"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Edit2,
  Check,
  X,
  Loader2,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Base API URL
const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export default function ProfileInfo({ customer }) {
  const router = useRouter();

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // OPTIMIZATION 1: Local Display State
  // This ensures that when we save, the UI updates INSTANTLY,
  // without waiting for the global context to refetch.
  const [displayData, setDisplayData] = useState({
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    email: customer?.email || "",
  });

  // Form State
  const [formData, setFormData] = useState({ ...displayData });

  // Sync state if customer prop updates externally
  useEffect(() => {
    if (customer) {
      setDisplayData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        email: customer.email || "",
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("medusa_auth_token");
      if (!token) throw new Error("لطفاً ابتدا وارد حساب کاربری شوید.");

      const res = await fetch(`${BASE_URL}/store/customers/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "خطا در بروزرسانی پروفایل.");
      }

      // OPTIMIZATION 2: Update Display Data Immediately
      setDisplayData({ ...formData });

      setSuccess("اطلاعات با موفقیت ذخیره شد!");
      setIsEditing(false);

      // Attempt to refresh server data in background
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header Section */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">اطلاعات هویتی</h2>
          <p className="text-sm text-gray-500">
            نام و نام خانوادگی خود را در این بخش مدیریت کنید.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setFormData({ ...displayData }); // Reset form to current display data
              setIsEditing(true);
              setError("");
              setSuccess("");
            }}
            className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
          >
            <Edit2
              size={16}
              className="text-gray-400 transition group-hover:text-black"
            />
            ویرایش اطلاعات
          </button>
        )}
      </div>

      {/* Main Card */}
      <div
        className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${isEditing ? "border-blue-200 ring-4 ring-blue-50/50" : "border-gray-200"}`}
      >
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSave}>
            <div className="space-y-6">
              {/* Identity Row */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* First Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="first_name"
                    className="text-sm font-bold text-gray-700"
                  >
                    نام
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                      placeholder="نام خود را وارد کنید"
                    />
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-700">
                      <User size={18} className="text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {displayData.first_name || (
                          <span className="text-gray-400 italic">
                            تعیین نشده
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="last_name"
                    className="text-sm font-bold text-gray-700"
                  >
                    نام خانوادگی
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-700">
                      <User size={18} className="text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {displayData.last_name || (
                          <span className="text-gray-400 italic">
                            تعیین نشده
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                  آدرس ایمیل
                  {isEditing && (
                    <span className="text-[10px] font-normal bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Shield size={10} /> غیرقابل تغییر
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-100/80 px-4 py-3 text-gray-500 cursor-not-allowed">
                  <Mail size={18} className="text-gray-400" />
                  <span className="font-medium dir-ltr text-right flex-1">
                    {displayData.email}
                  </span>
                </div>
                {isEditing && (
                  <p className="text-xs text-gray-400 mr-1">
                    برای تغییر ایمیل لطفاً با پشتیبانی تماس بگیرید.
                  </p>
                )}
              </div>
            </div>

            {/* Notifications */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-start gap-3"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-100 flex items-start gap-3"
                >
                  <Check size={18} className="shrink-0 mt-0.5" />
                  <p>{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-8 flex items-center gap-3 pt-6 border-t border-gray-100"
                >
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-xl bg-black px-8 py-3 text-sm font-bold text-white shadow-lg shadow-gray-200 transition-all hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Check size={18} />
                    )}
                    {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setError("");
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <X size={18} />
                    انصراف
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
