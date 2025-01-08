"use client";

import { useState, useEffect, useCallback } from "react";
import { Link, usePathname } from "@/i18n/routing";
import sidebarData from "@/sidebarData.json";
import Image from "next/image";
import { ArrowDown } from "./ui/icons/ArrowDown";
import { useTranslations } from "next-intl";

type SidebarItem = {
  name: string;
  link: string;
  children?: SidebarItem[];
  icon?: string;
  activeIcon?: string;
};
const toTranslationKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");

const Sidebar = () => {
  const t = useTranslations("nav");
  const pathname = usePathname() as string;
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const translatedSidebarData = sidebarData.map((item: SidebarItem) => ({
    ...item,
    name: t(toTranslationKey(item.name)),
    children: item.children?.map((child) => ({
      ...child,
      name: t(toTranslationKey(child.name)),
    })),
  }));

  const isActive = useCallback((link: string) => {
    if (link === '/dashboard') return false; // Skip /dashboard
    return pathname.startsWith(link);
  }, [pathname]);

  useEffect(() => {
    const activeItem = translatedSidebarData.find((item: SidebarItem) =>
      item.children?.some((child) => isActive(child.link))
    );
  
    // Only set open item if it’s a top-level item with children
    if (activeItem && activeItem.children) {
      setOpenItem(activeItem.name); // Set open item based on active parent
    } else if (!activeItem) {
      setOpenItem(null); // If no active items, close everything
    }
  }, [pathname, isActive, translatedSidebarData]);
  
  const toggleItem = (itemName: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const renderMenuItem = (
    item: SidebarItem,
    active: boolean,
    isParentActive: boolean
  ) => (
    <>
      {item.icon && (
        <span className="relative inline-block h-5 w-5 flex-shrink-0">
          <Image
            src={
              active || isParentActive
                ? item.activeIcon || "/default-active-icon.png"
                : item.icon || "/default-icon.png"
            }
            alt={item.name}
            className="object-contain"
            fill
          />
        </span>
      )}
      <span className="whitespace-nowrap capitalize">{item.name}</span>
    </>
  );

  const renderMenu = (items: SidebarItem[]) => {
    return items.map((item) => {
      const active = isActive(item.link);
      const isParentActive = !!item.children?.some((child) =>
        isActive(child.link)
      );

      const isOpen = openItems[item.name] ?? false;
      return (
        <li key={item.name} className="relative whitespace-nowrap">
          {item.children && item.children.length > 0 ? (
            <button
              onClick={() => toggleItem(item.name)}
              className={`w-full flex items-center px-4 py-2 text-balance font-medium rounded-md gap-3 ${
                active || isParentActive ? "text-primary" : ""
              }`}
            >
              {renderMenuItem(item, active, isParentActive)}
              <span
                className={`${
                  (openItem === item.name||isOpen) ? "rotate-180" : ""
                } ms-auto`}
              >
                <ArrowDown />
              </span>
            </button>
          ) : (
            <Link
              href={item.link}
              className={`w-full flex items-center px-4 py-2 text-balance font-medium rounded-md gap-3 ${
                active ? "bg-primary text-white" : "text-gray-600"
              }`}
            >
              {renderMenuItem(item, active, isParentActive)}
            </Link>
          )}
          {item.children && (openItem === item.name||isOpen) && (
            <ul className="py-4 pl-6">{renderMenu(item.children)}</ul>
          )}
        </li>
      );
    });
  };

  return (
    <div>
      <ul className="space-y-4">{renderMenu(translatedSidebarData)}</ul>
    </div>
  );
};

export default Sidebar;
