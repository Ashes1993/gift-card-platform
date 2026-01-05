"use client";
import { redirect } from "next/navigation";
import { useAccount } from "@/context/account-context";
import AccountLayout from "@/components/account/account-layout";
import ProfileInfo from "@/components/account/profile-info";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { customer, isLoading } = useAccount();

  // Use the loading state to prevent flickering
  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center text-gray-500 gap-2">
        <Loader2 className="animate-spin h-6 w-6" />
        <span>در حال بارگذاری حساب کاربری...</span>
      </div>
    );
  }

  // Redirect if not logged in
  if (!customer) {
    redirect("/account/login");
  }

  return (
    <AccountLayout activeTab="profile">
      <ProfileInfo customer={customer} />
    </AccountLayout>
  );
}
