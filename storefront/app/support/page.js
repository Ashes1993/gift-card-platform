"use client";

import { useActionState } from "react";
import { submitTicket } from "./actions";
import { Loader2, Send, CheckCircle } from "lucide-react";
import AccountLayout from "@/components/account/account-layout";

// Initial state for the server action
const initialState = {
  success: false,
  error: null,
};

export default function SupportPage() {
  const [state, formAction, isPending] = useActionState(
    submitTicket,
    initialState
  );

  if (state.success) {
    return (
      <AccountLayout activeTab="support">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">تیکت شما ثبت شد!</h2>
          <p className="mt-2 text-gray-500">
            شماره پیگیری تیکت شما:{" "}
            <span className="font-mono font-bold text-black dir-ltr inline-block">
              {state.ticketId}
            </span>
          </p>
          <p className="max-w-md mt-4 text-sm text-gray-500 leading-relaxed">
            یک ایمیل تایید برای شما ارسال شد. تیم پشتیبانی ما معمولاً در کمتر از
            ۲۴ ساعت پاسخ می‌دهد.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 text-sm font-semibold text-black underline hover:text-gray-600"
          >
            ارسال پیام جدید
          </button>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout activeTab="support">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">پشتیبانی مشتریان</h1>
          <p className="mt-1 text-sm text-gray-500">
            مشکلی در سفارش دارید؟ ما اینجا هستیم تا کمک کنیم.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-gray-700">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="مثال: علی محمدی"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
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
                placeholder="ali@example.com"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black text-right dir-ltr placeholder:text-right"
              />
            </div>
          </div>

          {/* Row 2 */}
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
                placeholder="#12345"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black text-right dir-ltr placeholder:text-right"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="text-sm font-bold text-gray-700"
              >
                موضوع
              </label>
              <select
                name="subject"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="General Inquiry">سوال عمومی</option>
                <option value="Order Issue">مشکل در سفارش</option>
                <option value="Refund Request">درخواست عودت وجه</option>
                <option value="Technical Support">مشکل فنی</option>
              </select>
            </div>
          </div>

          {/* Message */}
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
              rows={5}
              placeholder="لطفاً مشکل خود را با جزئیات شرح دهید..."
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
            ></textarea>
          </div>

          {/* Error Message */}
          {state.error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {state.error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isPending ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" /> در حال
                ارسال...
              </>
            ) : (
              <>
                ارسال تیکت <Send className="mr-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
