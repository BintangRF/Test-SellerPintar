"use client";

import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "@/components/formWrapper";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import Loader from "../Loader";

type Category = {
  name: string;
};

const categorySchema = z.object({
  name: z.string().min(1, "name is required"),
});

export default function CreateCategoryForm({
  id,
  refetch,
  onCancel,
}: {
  id?: string;
  refetch: () => void;
  onCancel: () => void;
}) {
  const { getData, pushData, loading } = useApi();

  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const defaultValues = useMemo(() => {
    if (!categoryData) {
      return {
        name: "",
      };
    }
    return {
      name: categoryData.name,
    };
  }, [categoryData]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const categoryResult = await getData(
          `/categories/${id}`,
          undefined,
          true
        );
        if (categoryResult) {
          setCategoryData(categoryResult);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (data: z.infer<typeof categorySchema>) => {
    const isEdit = Boolean(id);
    const endpoint = isEdit ? `/categories/${id}` : "/categories";
    const method = isEdit ? "put" : "post";

    const payload = {
      name: data.name,
    };

    const result = await pushData(endpoint, method, payload, undefined, true);
    if (result) {
      onCancel();
      refetch();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[25rem] mt-10">
        <Loader />
      </div>
    );
  }

  return (
    <FormWrapper
      schema={categorySchema}
      defaultValues={defaultValues}
      onSubmit={(data) => {
        handleSubmit(data);
      }}
    >
      {(form) => {
        return (
          <>
            {/* name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-6">
              <Button
                variant="ghost"
                onClick={() => onCancel()}
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
          </>
        );
      }}
    </FormWrapper>
  );
}
