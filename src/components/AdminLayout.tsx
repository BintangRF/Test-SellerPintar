"use client";

import React from "react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { Book, LogOut, TagIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDialog } from "@/context/DialogContext";
import { Button } from "./ui/button";
import Navbar from "./Navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showDialog, closeDialog } = useDialog() || {};
  const auth = useAuth();

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
  const menuItems = [
    { label: "Articles", path: "/dashboard/admin/articles", icon: <Book /> },
    { label: "Category", path: "/dashboard/admin/category", icon: <TagIcon /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex-[0_0_250px] bg-custom-blue border-r border-gray-200 p-4">
        <div className="text-xl font-semibold mb-6">Admin Panel</div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={clsx(
                "w-full text-left px-3 py-2 rounded  hover:bg-blue-400 transition flex text-custom-white",
                pathname === item.path ? "bg-blue-400  font-medium" : ""
              )}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button
            onClick={() =>
              showDialog &&
              showDialog(
                <LogoutDialog onCancel={() => closeDialog?.()} />,
                "Logout",
                "Are you sure want to logout?"
              )
            }
            className="w-full text-left flex px-3 py-2 rounded hover:bg-blue-400 transition text-custom-white"
          >
            <span className="mr-2">
              <LogOut />
            </span>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ">
        <Navbar />
        <div className="min-h-[calc(100vh-15rem)] p-6">{children}</div>
      </main>
    </div>
  );
}
