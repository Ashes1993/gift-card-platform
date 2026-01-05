"use client";

import { useAccount } from "@/context/account-context";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, ShoppingBag, Headset, LogOut } from "lucide-react";

// 🛠️ Translated Nav Items
const navItems = [
  { name: "پروفایل من", href: "/account/profile", icon: User, id: "profile" },
  {
    name: "سفارش‌های من",
    href: "/account/orders",
    icon: ShoppingBag,
    id: "orders",
  },
  { name: "پشتیبانی", href: "/support", icon: Headset, id: "support" },
];

export default function AccountLayout({ children, activeTab }) {
  const { logout } = useAccount();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tighter text-gray-900 mb-10">
        داشبورد حساب کاربری
      </h1>

      {/* RTL Layout Note: 
        In dir="rtl", 'flex-row' puts the first child (Sidebar) on the Right.
        This is exactly what we want for a Persian dashboard.
      */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-2">
            {navItems.map((item) => {
              // We compare the 'id' we added above to the activeTab prop
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ x: -5 }} // Move Left for RTL hover effect
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {/* Fixed: Changed mr-3 to ml-3 for RTL */}
                    <Icon className="h-5 w-5 ml-3" />
                    {item.name}
                  </Link>
                </motion.div>
              );
            })}

            <motion.button
              onClick={logout}
              whileHover={{ x: -5 }}
              transition={{ duration: 0.2 }}
              // Fixed: text-left -> text-right (or text-start)
              className="w-full text-start flex items-center p-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut className="h-5 w-5 ml-3" />
              خروج از حساب
            </motion.button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="grow bg-white p-6 sm:p-8 border border-gray-100 rounded-xl shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
