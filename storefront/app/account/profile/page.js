"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/context/account-context";
import AccountLayout from "@/components/account/account-layout";
import ProfileInfo from "@/components/account/profile-info";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { customer, isLoading } = useAccount();
  const router = useRouter();

  // SECURITY: Handle redirect in Effect to avoid render-phase interruptions
  useEffect(() => {
    if (!isLoading && !customer) {
      router.push("/account/login");
    }
  }, [isLoading, customer, router]);

  // --- LOADING STATE ---
  // Optimization: Keep the Layout visible while loading content
  // This prevents the whole sidebar from disappearing/flickering
  if (isLoading) {
    return (
      <AccountLayout activeTab="profile">
        <div className="flex h-[400px] w-full flex-col items-center justify-center gap-3 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm font-medium">در حال دریافت اطلاعات...</span>
        </div>
      </AccountLayout>
    );
  }

  // Fallback if redirect hasn't happened yet but customer is missing
  if (!customer) return null;

  // --- MAIN CONTENT ---
  return (
    <AccountLayout activeTab="profile">
      <div className="space-y-6">
        <div className="border-b border-gray-100 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            اطلاعات حساب کاربری
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            اطلاعات شخصی و تنظیمات امنیتی خود را در اینجا مدیریت کنید.
          </p>
        </div>

        <ProfileInfo customer={customer} />
      </div>
    </AccountLayout>
  );
}
