import React, { Suspense } from "react";
import LayoutWrapper from "@/components/LayoutWrapper";
import HeroSection from "@/components/articles/HeroSection";
import ListArticles from "@/components/articles/ListArticles";

export default function Articles() {
  return (
    <LayoutWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
        <ListArticles />
      </Suspense>
    </LayoutWrapper>
  );
}
