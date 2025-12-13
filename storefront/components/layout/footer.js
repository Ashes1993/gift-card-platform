// storefront/components/layout/footer.jsx

import Link from "next/link";
import { Mail, Headset, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Logo & Mission */}
          <div>
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter text-black"
            >
              GIFT<span className="text-blue-600">CARD</span>.IO
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Your fastest source for secure digital gift cards.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/store"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  Popular Brands
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Headset className="h-4 w-4 text-gray-400" />
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  Contact Us
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  FAQ / Docs
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Account */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Account
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/account/profile"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  Track Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/account/login"
                  className="text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} GIFTCARD.IO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
