import React from "react";
import ArticlesWrapper from "@/components/articles/ArticlesWrapper";
import HeroSection from "@/components/articles/HeroSection";
import ListArticles from "@/components/articles/ListArticles";

export default function Articles() {
  return (
    <ArticlesWrapper>
      <HeroSection />
      <ListArticles />
    </ArticlesWrapper>
  );
}
