"use client";

import Link from "next/link";
import { useAccount } from "@/context/account-context";
import { useCart } from "@/context/cart-context";

export function Navbar() {
  const { customer } = useAccount();
  const { cart, setIsOpen } = useCart();

  // Calculate total items in cart
  // (Medusa V2 sometimes nests items, so we check safely)
  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-black"
        >
          GIFT<span className="text-blue-600">CARD</span>.IO
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          {/* Account Link (Dynamic) */}
          {customer ? (
            <Link
              href="/account/profile"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Hello, {customer.first_name || "User"}
            </Link>
          ) : (
            <Link
              href="/account/login"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Sign In
            </Link>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-black">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
