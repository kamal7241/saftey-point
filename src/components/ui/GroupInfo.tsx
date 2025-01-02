"use client";
import type { GroupInfo } from "@/types/ui.types";
import React from "react";
import Copy from "./icons/Copy";
import { showToast } from "@/utils/toast";

export default function GroupInfo({ icon, label, content, copyIt }: GroupInfo) {
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
    <div className="flex w-64 flex-col gap-1.5">
      <div className="flexCenter capitalize text-light-400">
        {icon && <span className="w-6">{icon}</span>}
        {label}
      </div>
      <div className="flex items-center justify-between gap-2 whitespace-nowrap text-dark">
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
