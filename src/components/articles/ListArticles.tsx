"use client";

import { useGet } from "@/hooks/useApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import ArticleCard from "./ArticleCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

type ArticlesProps = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt?: string;
  category: {
    id: string;
    name: string;
  };
};

type ApiResponse = {
  data: ArticlesProps[];
  total: number;
};

export default function ListArticles() {
  const params = useSearchParams();
  const router = useRouter();

  const title = params.get("title");
  const category = params.get("category");
  const pageParam = parseInt(params.get("page") || "1", 10);

  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    title: title || "",
    category: category || "",
  });

  const { data: response, loading } = useGet<ApiResponse>(
    `/articles?${queryParams.toString()}`,
    { useToken: true }
  );

  const articles = response?.data || [];
  const articlesTotal = response?.total || 0;

  useEffect(() => {
    setTotal(articlesTotal);
    setTotalPages(Math.ceil(articlesTotal / limit));
  }, [articlesTotal, limit]);

  useEffect(() => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", page.toString());
    newParams.set("limit", limit.toString());
    router.replace(`?${newParams.toString()}`);
  }, [page, limit, params, router]);

  const start = (page - 1) * limit + 1;
  const end = Math.min(start + articles.length - 1, total);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[25rem] mt-9">
        <Loader />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {articles.length === 0 && !loading && (
        <div className="flex items-center justify-center h-[25rem] col-span-full">
          <p className="text-lg text-custom-black">No articles available</p>
        </div>
      )}

      {articles.length > 0 && (
        <p className="text-sm text-start col-span-full">
          Showing {start}–{end} of {total} articles
        </p>
      )}

      {articles.map((article: ArticlesProps) => (
        <ArticleCard key={article.id} {...article} />
      ))}

      {articles.length > 0 && (
        <div className="col-span-full mt-6">
          <Pagination>
            <PaginationContent className="flex justify-center">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
