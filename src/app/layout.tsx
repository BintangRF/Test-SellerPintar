import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DialogProvider } from "@/context/DialogContext";

export const metadata: Metadata = {
  title: "Home Test Frontend Web Developer",
  description: "Home Test Frontend Web Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-custom-gray">
        <DialogProvider>
          <AuthProvider>{children}</AuthProvider>
        </DialogProvider>
      </body>
    </html>
  );
}
