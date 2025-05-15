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
import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { z } from "zod";

const schema = z.object({
  username: z.string().nonempty({
    message: "Please enter your username",
  }),
  password: z.string().nonempty({
    message: "Please enter your password",
  }),
});

// user@example.com
// user123
export default function Login() {
  const { pushData } = useApi();

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    const response = await pushData("/auth/login", "post", data);
    if (response?.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      window.location.href = "/";
    }
  };

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

              <Button
                type="submit"
                className="mt-4 w-full bg-custom-blue text-custom-white"
              >
                Login
              </Button>
            </>
          )}
        </FormWrapper>

        <p className="text-custom-black font-extralight text-center mt-8">
          Don&apos;t have account?{" "}
          <Link href={"/register"} className="text-custom-blue underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
