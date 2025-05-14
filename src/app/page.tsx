"use client";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.isInitialized) return;

    if (!auth.isLoggedIn) {
      router.push("/login");
    } else if (auth.role === "User") {
      router.push("/articles");
    }
  }, [auth?.isInitialized, auth?.isLoggedIn, auth?.role, router]);

  if (!auth?.isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!auth?.isLoggedIn) {
    return null;
  }

  if (auth?.role === "User") {
    return null;
  }
}
