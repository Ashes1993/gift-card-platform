"use client";

import { motion } from "framer-motion";
import { Gift, Zap, ShieldCheck } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay: delay, duration: 0.5 }}
    className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg"
  >
    <Icon className="h-8 w-8 text-blue-600 mb-3" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter text-gray-900 text-center mb-12">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Zap}
            title="Instant Delivery"
            description="Codes are delivered immediately to your email after purchase. No waiting, no hassle."
            delay={0.1}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Guaranteed Security"
            description="All transactions are secured with the latest encryption standards. Your data is safe."
            delay={0.2}
          />
          <FeatureCard
            icon={Gift}
            title="Vast Selection"
            description="From gaming to retail, find gift cards for hundreds of global and local brands."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}
