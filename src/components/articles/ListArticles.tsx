"use client";

import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type ArticlesProps = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt?: string; // Tambahkan jika kamu punya tanggal artikel
  category: {
    id: string;
    name: string;
  };
};

export default function ListArticles() {
  const { getData } = useApi();
  const [articles, setArticles] = useState<ArticlesProps[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const result = await getData("/articles", undefined, true);
      setArticles(result?.data || []);
    };

    fetchArticles();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {articles.map((article) => (
        <Link
          href={`/articles/${article.id}`}
          key={article.id}
          className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
        >
          <div className="relative w-full h-56">
            <Image
              src={article.imageUrl}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
              priority
            />
          </div>

          <div className="p-5 flex flex-col justify-between">
            {article.createdAt && (
              <p className="text-sm text-custom-black/50 mb-2">
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}

            <h2 className="text-lg font-semibold text-custom-black mb-2 line-clamp-2 min-h-16">
              {article.title}
            </h2>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-16">
              {article.content}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              <span className="bg-blue-100 text-custom-blue text-xs font-medium px-3 py-1 rounded-full">
                {article.category.name}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
