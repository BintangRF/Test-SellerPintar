"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { CustomPopover } from "./CustomPopover";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useDialog } from "@/context/DialogContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const params = useParams();
  const pathname = usePathname();
  const { showDialog, closeDialog } = useDialog() || {};
  const auth = useAuth();

  const user = auth?.user;

  const isAdmin = pathname.startsWith("/dashboard/admin");
  const isWhiteNavbar = !!params?.id || pathname === "/profile" || isAdmin;

  const firstLetter = user?.username.charAt(0).toUpperCase();

  const LogoutDialog = ({ onCancel }: { onCancel: () => void }) => {
    const handleLogout = () => {
      if (auth?.logout) {
        auth.logout();
        closeDialog?.();
      }
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-end gap-2 mt-4 font-medium">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            onClick={handleLogout}
            className="bg-custom-blue text-custom-white"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`text-center py-3 ${
        !isWhiteNavbar
          ? "md:absolute"
          : "bg-custom-white border-b-1 border-custom-black/30"
      } inset-0 z-50 h-16`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-5 px-[5vw] ${
          isWhiteNavbar ? "text-custom-black/50" : "text-custom-white"
        }`}
      >
        {/* Logo */}
        {isWhiteNavbar ? (
          <Image
            src="/black-logo.png"
            alt="icon"
            width={120}
            height={120}
            className="block"
            priority
          />
        ) : (
          <>
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
          </>
        )}

        {/* Profile User */}

        {!isAdmin && (
          <CustomPopover
            side="bottom"
            align="end"
            trigger={
              <div
                className={`flex items-center gap-1 ${
                  isWhiteNavbar ? "text-custom-black" : "text-custom-white"
                }`}
              >
                <span className="bg-blue-300 rounded-full text-xl py-1 px-2.5 text-blue-700">
                  {firstLetter}
                </span>
                <span className="underline not-md:hidden">
                  {user?.username}
                </span>
              </div>
            }
            content={
              <div className=" flex flex-col">
                <Link
                  href="/profile"
                  className="border border-b-1 border-custom-black/30 p-4"
                >
                  <span className="not-md:hidden text-custom-black/50">
                    My Account
                  </span>
                </Link>
                <div
                  className="border border-b-1 border-custom-black/30 p-4"
                  onClick={() =>
                    showDialog &&
                    showDialog(
                      <LogoutDialog onCancel={() => closeDialog?.()} />,
                      "Logout",
                      "Are you sure want to logout?"
                    )
                  }
                >
                  <span className="not-md:hidden text-red-500 flex gap-2 cursor-pointer">
                    <LogOut />
                    Log out
                  </span>
                </div>
              </div>
            }
          />
        )}

        {/* Admin Panel */}
        {isAdmin && (
          <Link
            href={`/profile`}
            className={`flex items-center gap-1 ${
              isWhiteNavbar ? "text-custom-black" : "text-custom-white"
            }`}
          >
            <span className="bg-blue-300 rounded-full text-xl py-1 px-2.5 text-blue-700">
              {firstLetter}
            </span>
            <span className="underline not-md:hidden">{user?.username}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
