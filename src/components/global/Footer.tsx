import { Link } from "@/i18n/routing";
import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer className="px-6 py-1.5 bg-white shadow-custom">
      <div className="flex items-center justify-between">
        <div className="flexCenter">
          <Image
            src="/images/logo/sm-logo.webp"
            width={18}
            height={18}
            alt="sm logo"
          />
          <span className="text-gray-300 text-sm">
            Copyright © {new Date().getFullYear()} Safety Point. All Rights
            Reserved
          </span>
        </div>
        <ul className="flex items-center justify-center gap-2 text-gray-900 text-sm">
          <li>
            <Link href="/about" className="hover:underline">About</Link>
          </li>
          <li>{" - "}</li>
          <li>
            <Link href="/support" className="hover:underline">Support</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
