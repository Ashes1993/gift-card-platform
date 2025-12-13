"use client";
import { redirect } from "next/navigation";
import { useAccount } from "@/context/account-context";
import AccountLayout from "@/components/account/account-layout"; // We'll create this component next
import ProfileInfo from "@/components/account/profile-info"; // We'll create this component next

// This page must be a client component since it uses useAccount()
export default function ProfilePage() {
  const { customer, isLoading } = useAccount();

  // Use the loading state to prevent flickering
  if (isLoading) {
    return <div className="text-center py-20">Loading profile...</div>;
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
