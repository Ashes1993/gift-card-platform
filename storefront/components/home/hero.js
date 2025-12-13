"use client"; // <--- Crucial for Framer Motion

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 pb-28 md:pt-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 mb-6 leading-tight"
        >
          The Easiest Way to Send <br />
          <span className="text-blue-600">Digital Gift Cards.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl text-gray-500 max-w-2xl mx-auto mb-10"
        >
          Instant delivery, secure purchase, and a vast selection of your
          favorite brands—all in one place.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href="/store"
            className="inline-flex items-center rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-500/50"
          >
            Start Shopping Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
