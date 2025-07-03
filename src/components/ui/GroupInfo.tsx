"use client";
import type { GroupInfo } from "@/types/ui.types";
import React from "react";
import Copy from "./icons/Copy";
import { showToast } from "@/utils/toast";

export default function GroupInfo({ icon, label, content, copyIt, block, className }: GroupInfo & { className?: string }) {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(String(content))
      .then(() => {
        showToast.success("Copied to clipboard!");
      })
      .catch(() => {
        showToast.error("Failed to copy!");
      });
  };
  return (
    <div className={`flex flex-col gap-1.5 ${block?"w-full":"w-64"} ${className}`}>
      <div className="text-light-400 flex items-start justify-start gap-2">
        {icon && <span className="w-6">{icon}</span>}
        {label}
      </div>
      <div className="flex items-center gap-2 whitespace-nowrap text-dark">
        {content}
        {copyIt && (
          <span
            className="w-[18px] flex-none cursor-pointer"
            onClick={handleCopy}
            aria-label="Copy to clipboard"
          >
            <Copy />
          </span>
        )}
      </div>
    </div>
  );
}
