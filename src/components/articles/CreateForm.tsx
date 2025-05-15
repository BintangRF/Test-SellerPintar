"use client";

import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormWrapper } from "@/components/formWrapper";
import { useEffect, useMemo, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useApi } from "@/hooks/useApi";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Loader from "../Loader";
import { useAuth } from "@/context/AuthContext";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.any().optional(),
  userId: z.string().optional(),
});

type CategoriesProps = { id: string; name: string };
type Article = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: { id: string; name: string };
};

export default function CreateArticleForm() {
  const { getData, pushData, loading } = useApi();
  const auth = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const userId = auth?.user?.id;

  const [categories, setCategories] = useState<CategoriesProps[]>([]);
  const [articleData, setArticleData] = useState<Article | null>(null);
  const defaultValues = useMemo(() => {
    if (!articleData) {
      return {
        title: "",
        categoryId: "",
        content: "",
        imageUrl: null,
      };
    }
    return {
      title: articleData.title,
      categoryId: articleData.category.id,
      content: articleData.content,
      imageUrl: articleData.imageUrl,
    };
  }, [articleData]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      const categoriesResult = await getData("/categories", undefined, true);
      setCategories(categoriesResult?.data || []);

      // Only fetch article if editing
      if (id) {
        const articleResult = await getData(`/articles/${id}`, undefined, true);
        if (articleResult) {
          setArticleData(articleResult);
        }
      }
    };

    fetchData();
  }, [id, getData]);

  const handleSubmit = async (data: z.infer<typeof articleSchema>) => {
    const isEdit = Boolean(id);
    const endpoint = isEdit ? `/articles/${id}` : "/articles";
    const method = isEdit ? "put" : "post";

    const payload = {
      title: data.title,
      categoryId: data.categoryId,
      content: data.content,
      imageUrl: data.imageUrl || "https://placehold.co/600x400/png",
      userId: userId || undefined,
    };

    const result = await pushData(endpoint, method, payload, undefined, true);
    if (result) {
      router.back();
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const handleCancel = () => router.back();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[25rem] mt-10">
        <Loader />
      </div>
    );
  }

  return (
    <FormWrapper
      schema={articleSchema}
      defaultValues={defaultValues}
      onSubmit={(data) => {
        handleSubmit({ ...data, userId });
      }}
    >
      {(form) => {
        return (
          <div className="space-y-6 bg-custom-white p-6 rounded-md">
            <div
              className="border-b pb-4 cursor-pointer"
              onClick={handleCancel}
            >
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ArrowLeft />
                {id ? "Edit Article" : "Create Article"}
              </h1>
            </div>

            {/* imageUrl */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>imageUrl</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-start space-y-2">
                      <label className="border-dashed border border-gray-300 rounded-md w-full h-32 flex items-center justify-center text-sm text-gray-500 cursor-pointer">
                        {field.value && typeof field.value !== "string" ? (
                          <img
                            src={URL.createObjectURL(field.value)}
                            alt="Preview"
                            className="h-full object-contain"
                          />
                        ) : field.value ? (
                          <img
                            src={field.value}
                            alt="Preview"
                            className="h-full object-contain"
                          />
                        ) : (
                          "Click or drag image to upload (1200x630 recommended)"
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (max. 2MB). Recommended size: 1200x630
                    pixels.
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My article title" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-custom-white text-custom-black">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-custom-white z-40">
                      {categories
                        .filter((category) => category.id)
                        .map((category) => (
                          <SelectItem value={category.id} key={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={modules}
                      className="[&_.ql-editor]:min-h-[300px]"
                      placeholder="Write your article content here..."
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-6">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="bg-white text-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {id ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        );
      }}
    </FormWrapper>
  );
}
