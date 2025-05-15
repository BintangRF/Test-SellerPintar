// app/(client)/profile/page.tsx atau app/profile/page.tsx
"use client";

import AdminLayout from "@/components/AdminLayout";
import LayoutWrapper from "@/components/LayoutWrapper";
import ProfileCard from "@/components/ProfileCard";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  username: string;
  role: string;
};

export default function ProfilePage() {
  const { getData } = useApi();
  const router = useRouter();
  const auth = useAuth();

  const BackFunction = () => {
    router.back();
  };

  const isAdmin = auth?.role === "Admin";
  const isUser = auth?.role === "User";

  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getData("/auth/profile", undefined, true);
      if (result) setUser(result);
    };

    fetchUser();
  }, [getData]);

  return (
    <>
      {isUser && user && (
        <LayoutWrapper>
          {user && <ProfileCard user={user} onBack={() => BackFunction()} />}
        </LayoutWrapper>
      )}

      {isAdmin && user && (
        <AdminLayout>
          {user && <ProfileCard user={user} onBack={() => BackFunction()} />}
        </AdminLayout>
      )}
    </>
  );
}
