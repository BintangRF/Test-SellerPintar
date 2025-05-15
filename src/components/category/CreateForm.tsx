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
import { useMemo } from "react";
import { useGet, usePost } from "@/hooks/useApi";
import Loader from "../Loader";

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
  const { post } = usePost();

  const { data, loading } = useGet(`/categories/${id}`, {
    useToken: true,
  });

  const category = id ? data : null;

  const defaultValues = useMemo(() => {
    if (!category) {
      return {
        name: "",
      };
    }
    return {
      name: category.name as string,
    };
  }, [category]);

  const handleSubmit = async (data: z.infer<typeof categorySchema>) => {
    const isEdit = Boolean(id);
    const endpoint = isEdit ? `/categories/${id}` : "/categories";
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      name: data.name,
    };

    const result = await post({
      url: endpoint,
      method: method,
      data: payload,
      useToken: true,
      isFormData: false,
    });

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
