"use client";

import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  email: string;
};

export default function Navbar() {
  const { getData } = useApi();

  const [users, setUsers] = useState<User>();

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getData("/auth/profile", undefined, true);
      if (result) setUsers(result);
    };

    fetchUsers();
  }, [getData]);

  const firstLetter = users?.username.charAt(0).toUpperCase();

  return (
    <div className="text-center py-3 md:absolute inset-0 z-50 h-16">
      <div className="mx-auto flex items-center justify-between gap-5 px-[5vw]">
        <Image
          src="/white-logo.png"
          alt="icon"
          width={120}
          height={120}
          className="hidden md:block"
          priority
        />
        <Image
          src="/black-logo.png"
          alt="icon"
          width={120}
          height={120}
          className="block md:hidden"
          priority
        />

        <Link
          href="/profile"
          className="text-custom-white flex items-center gap-1"
        >
          <span className="bg-blue-300 rounded-full text-xl py-1 px-2.5 text-blue-700">
            {firstLetter}
          </span>
          <span className="underline not-md:hidden">{users?.username}</span>
        </Link>
      </div>
    </div>
  );
}
