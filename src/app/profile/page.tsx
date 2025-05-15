// app/(client)/profile/page.tsx atau app/profile/page.tsx
"use client";

import AdminLayout from "@/components/AdminLayout";
import UserLayout from "@/components/UserLayout";
import ProfileCard from "@/components/ProfileCard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();

  const user = auth?.user;

  const BackFunction = () => {
    router.back();
  };

  const isAdmin = auth?.role === "Admin";
  const isUser = auth?.role === "User";

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {isUser && user && (
        <UserLayout>
          {user && <ProfileCard user={user} onBack={() => BackFunction()} />}
        </UserLayout>
      )}

      {isAdmin && user && (
        <AdminLayout>
          {user && <ProfileCard user={user} onBack={() => BackFunction()} />}
        </AdminLayout>
      )}
    </>
  );
}
