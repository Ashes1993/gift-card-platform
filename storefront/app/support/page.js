"use client";

import { useActionState } from "react"; // <--- CHANGED: Import from 'react', renamed
import { submitTicket } from "./actions";
import { Loader2, Send, CheckCircle } from "lucide-react";
import AccountLayout from "@/components/account/account-layout";

// Initial state for the server action
const initialState = {
  success: false,
  error: null,
};

export default function SupportPage() {
  // CHANGED: useActionState gives us 'isPending' automatically as the 3rd argument
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
          <h2 className="text-2xl font-bold text-gray-900">
            Ticket Submitted!
          </h2>
          <p className="mt-2 text-gray-500">
            Your Ticket ID is{" "}
            <span className="font-mono font-bold text-black">
              {state.ticketId}
            </span>
            .
          </p>
          <p className="max-w-md mt-4 text-sm text-gray-500">
            We have sent a confirmation email to you. Our team typically replies
            within 24 hours.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 text-sm font-semibold text-black underline hover:text-gray-600"
          >
            Send another message
          </button>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout activeTab="support">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Customer Support</h1>
          <p className="mt-1 text-sm text-gray-500">
            Have an issue with an order? We are here to help.
          </p>
        </div>

        {/* CHANGED: We pass 'formAction' directly to the form now */}
        <form action={formAction} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="orderId"
                className="text-sm font-medium text-gray-700"
              >
                Order ID (Optional)
              </label>
              <input
                type="text"
                name="orderId"
                placeholder="#12345"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <select
                name="subject"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Order Issue">Issue with an Order</option>
                <option value="Refund Request">Refund Request</option>
                <option value="Technical Support">Technical Support</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-700"
            >
              How can we help?
            </label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Describe your issue in detail..."
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
            ></textarea>
          </div>

          {/* Error Message */}
          {state.error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {state.error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending} // CHANGED: Using the native hook state
            className="flex w-full items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                Submit Ticket <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
