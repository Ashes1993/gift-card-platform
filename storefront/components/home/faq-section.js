"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    question: "How instantly will I receive my code?",
    answer:
      "Immediately! Our system is automated. Once your payment is confirmed (usually instantly for cards/crypto), the code is sent to your email and displayed on your screen.",
  },
  {
    question: "Can I pay with Cryptocurrency?",
    answer:
      "Yes, we support Bitcoin, Ethereum, USDT (TRC20/ERC20), and more via NOWPayments. It's secure, private, and often cheaper than credit card fees.",
  },
  {
    question: "Do you need my ID or personal documents?",
    answer:
      "No. We value your privacy. For standard crypto purchases, no ID verification (KYC) is required. You can buy completely anonymously.",
  },
  {
    question: "Is this global or region locked?",
    answer:
      "We offer both Global and Region-Specific cards. Please check the product title (e.g., 'US Only' or 'Global') before purchasing to ensure it works in your country.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-gray-500">
            Everything you need to know about buying digital cards.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left font-medium text-gray-900 transition hover:bg-gray-50"
              >
                {faq.question}
                {openIndex === idx ? (
                  <Minus className="h-5 w-5 text-blue-600" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
