"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import parse from "html-react-parser";

type ArticleCardProps = {
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

export default function ArticleCard({
  id,
  title,
  content,
  imageUrl,
  createdAt,
  category,
}: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
    >
      <div className="relative w-full h-56">
        <Image
          src={imageUrl || "https://placehold.co/600x400/png"}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
          priority
        />
      </div>

      <div className="p-5 flex flex-col justify-between">
        {createdAt && (
          <p className="text-sm text-custom-black/50 mb-2">
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        <h2 className="text-lg font-semibold text-custom-black mb-2 line-clamp-2 min-h-16">
          {title}
        </h2>

        <div className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-16">
          {parse(content)}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          <span className="bg-blue-100 text-custom-blue text-xs font-medium px-3 py-1 rounded-full">
            {category.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
