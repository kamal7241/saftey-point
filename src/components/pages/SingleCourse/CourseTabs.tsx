import React from "react";
import { useTranslations } from "next-intl";

type ActiveTab = "course_info" | "pricing" | "exam" | "certificate" | "sessions";
const TABS: ActiveTab[] = ["course_info", "pricing", "certificate", "exam", "sessions"];

interface CourseTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  disabled: boolean; // Disable tabs while editing
}

export default function CourseTabs({ activeTab, onTabChange, disabled }: CourseTabsProps) {
  const t = useTranslations("common.tab");

  return (
    <div className="flex gap-4 border-b border-gray-900 border-opacity-15 px-4">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => !disabled && onTabChange(tab)}
          disabled={disabled}
          className={`px-4 py-3 text-lg font-medium capitalize transition-colors duration-200 focus:outline-none ${
            activeTab === tab
              ? "border-b-2 border-primary text-primary"
              : "border-b-2 border-transparent text-light-400 hover:text-dark"
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {t(tab)}
        </button>
      ))}
    </div>
  );
}