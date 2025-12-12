"use client";

import { useAccount } from "@/context/account-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { customer, isLoading, logout } = useAccount();
  const router = useRouter();

  // Protection Hook: Redirect if not logged in
  useEffect(() => {
    // If loading is complete AND customer is null, redirect to login
    if (!isLoading && !customer) {
      router.push("/account/login");
    }
  }, [isLoading, customer, router]);

  // Show a loading state while we check the session
  if (isLoading || !customer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl font-medium text-gray-700">Loading profile...</p>
      </div>
    );
  }

  // Once customer data is loaded, display the profile
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome back, {customer.first_name}!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This is your account dashboard.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-lg font-medium text-gray-900">
              Account Details
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              **Full Name:** {customer.first_name} {customer.last_name}
            </p>
            <p className="text-sm text-gray-700">**Email:** {customer.email}</p>
            <p className="text-sm text-gray-700">
              **Joined:** {new Date(customer.created_at).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={logout}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
