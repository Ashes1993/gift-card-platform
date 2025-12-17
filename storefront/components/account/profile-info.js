"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Edit2, Check, X, Loader2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

// Base API URL
const BASE_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export default function ProfileInfo({ customer }) {
  const router = useRouter();

  // State for toggling Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    email: customer?.email || "", // Email is usually Read-Only for security
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Save (Update Backend)
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("medusa_auth_token");
      if (!token) throw new Error("You are not logged in.");

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
          // We generally don't send email here unless we want to trigger a change-email flow
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile.");
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Force a refresh so the Account Context picks up new data
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Animation Variants
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Personal Information
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account details and identity.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black hover:shadow-sm"
          >
            <Edit2
              size={16}
              className="text-gray-400 transition group-hover:text-black"
            />
            Edit Profile
          </button>
        )}
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSave}>
            <div className="space-y-6">
              {/* Identity Section */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* First Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="first_name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-700">
                      <User size={18} className="text-gray-400" />
                      <span className="font-medium">
                        {customer.first_name || "—"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="last_name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-700">
                      <User size={18} className="text-gray-400" />
                      <span className="font-medium">
                        {customer.last_name || "—"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                  Email Address
                  <span className="text-xs font-normal text-gray-400 flex items-center gap-1">
                    <Shield size={12} /> Secure & Read-only
                  </span>
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 cursor-not-allowed opacity-80">
                  <Mail size={18} />
                  <span className="font-medium">{formData.email}</span>
                </div>
              </div>
            </div>

            {/* Error / Success Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center gap-2"
                >
                  <X size={16} /> {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-600 border border-green-100 flex items-center gap-2"
                >
                  <Check size={16} /> {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Actions */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-8 flex items-center gap-4 overflow-hidden pt-2 border-t border-gray-100"
                >
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        // Reset form on cancel
                        first_name: customer.first_name || "",
                        last_name: customer.last_name || "",
                        email: customer.email || "",
                      });
                      setError("");
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <X size={16} />
                    Cancel
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
