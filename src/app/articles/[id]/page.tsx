"use client";

import { useApi } from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import ArticleCard from "@/components/articles/ArticleCard";
import LayoutWrapper from "@/components/LayoutWrapper";
import parse from "html-react-parser";

type ArticleDetail = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt?: string;
  category: {
    id: string;
    name: string;
  };
  user: {
    username: string;
  };
};

export default function ArticleDetail() {
  const { getData, loading } = useApi();
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleDetail[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      const result = await getData(`/articles/${id}`);
      if (result) {
        setArticle(result);

        // Fetch related articles
        const related = await getData(
          `/articles?category=${result.category.id}&excludeId=${result.id}&limit=3`
        );
        setRelatedArticles(related?.data || []);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading || !article) {
    return (
      <div className="flex items-center justify-center h-[25rem] mt-10">
        <Loader />
      </div>
    );
  }

  return (
    <LayoutWrapper>
      <div className="py-10 px-6 md:px-24 bg-custom-white">
        {/* Article Header */}
        <div className="mb-8 mx-auto text-center">
          <p className="text-sm text-custom-black/80">
            <span className="font-medium">
              {article?.createdAt &&
                new Date(article.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </span>
            <span className="mx-2">|</span>
            <span className="font-medium">
              Created by {article?.user?.username}
            </span>
          </p>
          <h1 className="text-4xl font-bold text-custom-black mb-4">
            {article.title}
          </h1>
        </div>

        {/* Article Image */}
        <div className="mb-8">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-80 object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Article Content */}
        <div className="prose max-w-none mb-12">{parse(article.content)}</div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-custom-black mb-6">
              Related Articles in "{article.category.name}"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <ArticleCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}
