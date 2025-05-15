import React, { Suspense } from "react";
import UserLayout from "@/components/UserLayout";
import HeroSection from "@/components/articles/HeroSection";
import ListArticles from "@/components/articles/ListArticles";

export default function Articles() {
  return (
    <UserLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
        <ListArticles />
      </Suspense>
    </UserLayout>
  );
}
