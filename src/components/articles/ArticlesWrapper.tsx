import React from "react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function ArticlesWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />

      <div className="flex-1">{children}</div>

      <Footer />
    </div>
  );
}
