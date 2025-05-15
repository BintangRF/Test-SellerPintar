"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormWrapper } from "@/components/formWrapper";
import { Input, PasswordInput } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePost } from "@/hooks/useApi";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  username: z.string().nonempty({
    message: "Please enter your username",
  }),
  password: z.string().nonempty({
    message: "Please enter your password",
  }),
  role: z.string().nonempty({
    message: "Please enter your role",
  }),
});

export default function Register() {
  const { post } = usePost();
  const router = useRouter();
  const handleSubmit = async (data: z.infer<typeof schema>) => {
    const response = await post({
      url: "/auth/register",
      data: data,
      useToken: false,
      isFormData: false,
    });

    if (response) {
      router.push("/login");
    }
  };

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "User", label: "User" },
  ];
  return (
    <div className="flex justify-center items-center min-h-screen p-10 not-md:bg-custom-white">
      <div className="w-full max-w-md bg-custom-white p-8 rounded-lg md:shadow-md">
        <Image
          src="/black-logo.png"
          alt="icon"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />

        <FormWrapper
          schema={schema}
          onSubmit={handleSubmit}
          defaultValues={{
            username: "",
            password: "",
            role: "",
          }}
        >
          {(form) => (
            <>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Input username" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Input password" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent className="bg-custom-white">
                          {roleOptions.map((option) => {
                            return (
                              <SelectItem
                                value={option.value}
                                key={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-4 w-full bg-custom-blue text-custom-white"
              >
                Register
              </Button>
            </>
          )}
        </FormWrapper>

        <p className="text-custom-black font-extralight text-center mt-8">
          Already have an account?{" "}
          <Link href={"/login"} className="text-custom-blue underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
