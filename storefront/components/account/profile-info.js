// storefront/components/account/profile-info.jsx
import { Mail, User, Phone, Home } from "lucide-react";

export default function ProfileInfo({ customer }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-3">
        Personal Information
      </h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4 p-3 border rounded-lg bg-gray-50">
          <User className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-xs font-medium text-gray-500">Full Name</p>
            <p className="text-base text-gray-800">
              {customer.first_name} {customer.last_name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-3 border rounded-lg bg-gray-50">
          <Mail className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-xs font-medium text-gray-500">Email Address</p>
            <p className="text-base text-gray-800">{customer.email}</p>
          </div>
        </div>

        {/* Placeholder for phone and address */}
        <div className="flex items-center space-x-4 p-3 border rounded-lg bg-gray-50 opacity-60">
          <Phone className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-xs font-medium text-gray-500">Phone</p>
            <p className="text-base text-gray-800">
              {customer.phone || "N/A (Update Coming Soon)"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-3 border rounded-lg bg-gray-50 opacity-60">
          <Home className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-xs font-medium text-gray-500">Default Address</p>
            <p className="text-base text-gray-800">
              N/A (Manage Addresses Option Coming Soon)
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        **Future Scope:** Add "Edit Profile" button to update details.
      </p>
    </div>
  );
}
