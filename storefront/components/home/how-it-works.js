"use client";

import { motion } from "framer-motion";
import { Search, CreditCard, Mail } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Choose Your Card",
    desc: "Browse hundreds of regional and global gift cards.",
  },
  {
    icon: CreditCard,
    title: "2. Secure Payment",
    desc: "Pay securely using Crypto, Credit Card, or PayPal.",
  },
  {
    icon: Mail,
    title: "3. Instant Delivery",
    desc: "Receive your digital code in your email instantly.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Get your gift card in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 border-4 border-white shadow-lg mb-6">
                <step.icon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500 max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
