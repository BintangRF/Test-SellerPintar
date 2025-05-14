"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { ReactNode } from "react";

interface FormWrapperProps<T extends z.ZodTypeAny> {
  schema: T;
  defaultValues?: z.infer<T>;
  onSubmit: (data: z.infer<T>) => void;
  children: (methods: UseFormReturn<z.infer<T>>) => ReactNode;
}

export function FormWrapper<T extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: FormWrapperProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {children(form)}
      </form>
    </Form>
  );
}
