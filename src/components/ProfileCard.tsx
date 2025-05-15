// components/UserProfileCard.tsx

"use client";

import React from "react";

type User = {
  username: string;
  role: string;
};

interface ProfileCardProps {
  user: User;
  onBack?: () => void;
}

export default function ProfileCard({ user, onBack }: ProfileCardProps) {
  const firstLetter = user?.username?.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center justify-center bg-white min-h-[calc(100vh-10rem)]">
      <h1 className="text-xl font-semibold mb-6">User Profile</h1>

      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-3xl font-bold mb-6">
        {firstLetter || "?"}
      </div>

      {/* User Info */}
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          {[
            { label: "Username", value: user?.username },
            { label: "Role", value: user?.role },
          ].map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-4 items-center px-4 py-3 bg-custom-gray rounded-sm"
            >
              <span className="font-semibold text-gray-600">{item.label}</span>
              <span className="mx-1 text-gray-600 col-span-1">:</span>
              <span className="text-gray-800 col-span-2 text-end">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="mt-6 w-full max-w-sm bg-custom-blue text-white py-2 rounded"
        >
          Back
        </button>
      )}
    </div>
  );
}
