"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { useApi } from "@/hooks/useApi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CategoriesProps = {
  id: string;
  name: string;
};

export default function HeroSection() {
  const { getData } = useApi();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<CategoriesProps[]>([]);
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getData("/categories", undefined, true);
      const categoriesData = result?.data || [];
      setCategories([{ id: "all", name: "All" }, ...categoriesData]);
    };

    fetchCategories();
  }, [getData]);

  // Update query params in URL
  const updateQueryParams = (paramsObj: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(paramsObj).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key)
    );
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle category and title changes
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    updateQueryParams({ category: value === "all" ? undefined : value, title });
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    updateQueryParams({ category, title: value });
  };

  // Initialize state from URL query params
  useEffect(() => {
    setTitle(searchParams.get("title") || "");
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  return (
    <div className="relative w-full h-[calc(100vh-10vw)]">
      <Image
        src="/hero-section.jpg"
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-custom-blue opacity-70"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 z-40">
        <p className="text-sm font-bold">Blog genzet</p>
        <h1 className="text-4xl font-bold max-w-2xl text-center">
          The Journal : Design Resources, Interviews, and Industry News
        </h1>
        <p className="text-xl">Your daily dose of design insights!</p>

        <div className="bg-custom-blue p-2 rounded-sm w-[clamp(30vw,_45rem,_85vw)]">
          <div className="flex gap-2 not-md:flex-col">
            {/* Category Select */}
            <Select onValueChange={handleCategoryChange} value={category}>
              <SelectTrigger className="w-[clamp(100%,_1rem,_5rem)] bg-custom-white text-custom-black flex-1">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-custom-white z-40">
                {categories
                  .filter((cat) => cat.id !== "")
                  .map((category) => (
                    <SelectItem value={category.id} key={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Title Input */}
            <Input
              placeholder="Search Articles"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="bg-custom-white text-custom-black clamp(100%,_100%,_12rem)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
