import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <div className="bg-custom-blue text-center py-6">
      <div className="mx-auto flex not-md:flex-col items-center justify-center gap-5">
        <Image src="/white-logo.png" alt="icon" width={120} height={120} />
        <p className="font-light text-custom-white text-sm">
          © 2025 Blog genzet. All rights reserved.
        </p>
      </div>
    </div>
  );
}
