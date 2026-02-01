"use client";

import { useActionState, useEffect } from "react";
import { submitTicket } from "./actions";
import { useAccount } from "@/context/account-context"; // <--- Import Context
import { Loader2, Send, CheckCircle, HelpCircle } from "lucide-react";
import AccountLayout from "@/components/account/account-layout";
import Link from "next/link";

const initialState = {
  success: false,
  error: null,
};

export default function SupportPage() {
  const [state, formAction, isPending] = useActionState(
    submitTicket,
    initialState,
  );
  const { customer } = useAccount(); // <--- Get current user info

  // Scroll to top on Success
  useEffect(() => {
    if (state.success) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.success]);

  // --- SUCCESS VIEW ---
  if (state.success) {
    return (
      <AccountLayout activeTab="support">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-green-200 bg-green-50/30 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-sm ring-4 ring-green-50 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">تیکت شما ثبت شد!</h2>
          <p className="mt-2 text-gray-500">
            شماره پیگیری تیکت شما:{" "}
            <span className="font-mono font-bold text-black dir-ltr inline-block bg-white px-2 py-1 rounded border border-gray-200 mx-1">
              {state.ticketId}
            </span>
          </p>
          <p className="max-w-md mt-4 text-sm text-gray-500 leading-relaxed">
            یک ایمیل تایید برای شما ارسال شد. تیم پشتیبانی ما معمولاً در کمتر از
            ۲۴ ساعت پاسخ می‌دهد.
          </p>
          <Link
            href="/store"
            className="mt-8 rounded-xl bg-black px-8 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </AccountLayout>
    );
  }

  // --- FORM VIEW ---
  return (
    <AccountLayout activeTab="support">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            پشتیبانی مشتریان
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            مشکلی در سفارش دارید؟ فرم زیر را پر کنید تا کارشناسان ما بررسی کنند.
          </p>
        </div>

        <form action={formAction} className="space-y-8">
          {/* Section 1: Identity */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-gray-700">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                name="name"
                required
                // AUTO-FILL: Use customer name if available
                defaultValue={
                  customer ? `${customer.first_name} ${customer.last_name}` : ""
                }
                placeholder="مثال: علی محمدی"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-gray-700"
              >
                آدرس ایمیل
              </label>
              <input
                type="email"
                name="email"
                required
                // AUTO-FILL: Use customer email if available
                defaultValue={customer?.email || ""}
                placeholder="ali@example.com"
                // UX FIX: Email should be LTR and Left Aligned for readability
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black text-left dir-ltr placeholder:text-right"
              />
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="orderId"
                className="text-sm font-bold text-gray-700"
              >
                شماره سفارش (اختیاری)
              </label>
              <input
                type="text"
                name="orderId"
                placeholder="#5200..."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black text-left dir-ltr placeholder:text-right"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="text-sm font-bold text-gray-700"
              >
                موضوع درخواست
              </label>
              <div className="relative">
                <select
                  name="subject"
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="General Inquiry">سوال عمومی</option>
                  <option value="Order Issue">
                    مشکل در سفارش / عدم دریافت کد
                  </option>
                  <option value="Refund Request">درخواست عودت وجه</option>
                  <option value="Technical Support">مشکل فنی در سایت</option>
                  <option value="Partnership">پیشنهاد همکاری</option>
                </select>
                {/* Custom chevron for select */}
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Message */}
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-bold text-gray-700"
            >
              پیام شما
            </label>
            <textarea
              name="message"
              required
              rows={6}
              placeholder="لطفاً مشکل خود را با جزئیات کامل شرح دهید..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black placeholder:text-gray-400 resize-y min-h-[120px]"
            ></textarea>
          </div>

          {/* Info Box */}
          <div className="flex gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
            <HelpCircle className="h-5 w-5 shrink-0" />
            <p className="leading-relaxed">
              تیم پشتیبانی ما در روزهای کاری از ساعت ۹ صبح تا ۹ شب پاسخگوی
              شماست. در روزهای تعطیل ممکن است پاسخگویی کمی زمان‌بر باشد.
            </p>
          </div>

          {/* Error Message */}
          {state.error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in slide-in-from-top-2">
              {state.error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-xl bg-black px-6 py-4 text-sm font-bold text-white transition-all hover:bg-gray-800 hover:shadow-lg disabled:bg-gray-400 disabled:shadow-none active:scale-[0.99]"
          >
            {isPending ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                در حال ارسال...
              </>
            ) : (
              <>
                ثبت و ارسال تیکت <Send className="mr-2 h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
