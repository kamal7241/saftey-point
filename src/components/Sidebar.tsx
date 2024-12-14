"use client";

import { useState, useEffect, useCallback } from "react";
import { Link, usePathname } from "@/i18n/routing";
import sidebarData from "@/sidebarData.json";
import Image from "next/image";
import { ArrowDown } from "./ui/icons/ArrowDown";

type SidebarItem = {
  name: string;
  link: string;
  children?: SidebarItem[];
  icon?: string;
  activeIcon?: string;
};

const Sidebar = () => {
  const pathname = usePathname() as string;
  const [openItem, setOpenItem] = useState<string | null>(null);

  const isActive = useCallback((link: string) => pathname === link, [pathname]);

  useEffect(() => {
    const activeItem = sidebarData.find((item: SidebarItem) =>
      item.children?.some((child) => isActive(child.link))
    );
    if (activeItem) setOpenItem(activeItem.name);
  }, [pathname, isActive]);

  const toggleItem = (itemName: string) => {
    setOpenItem((prev) => (prev === itemName ? null : itemName));
  };

  const renderMenuItem = (item: SidebarItem, active: boolean, isParentActive: boolean) => (
    <>
      {item.icon && (
        <span className="relative flex-shrink-0 inline-block w-5 h-5">
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
      <span>{item.name}</span>
    </>
  );

  const renderMenu = (items: SidebarItem[]) => {
    return items.map((item) => {
      const active = isActive(item.link);
      const isParentActive = !!item.children?.some((child) => isActive(child.link));


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
                className={`${openItem === item.name ? "rotate-180" : ""} ms-auto`}
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
          {item.children && openItem === item.name && (
            <ul className="pl-6">{renderMenu(item.children)}</ul>
          )}
        </li>
      );
    });
  };

  return (
    <div>
      <ul className="space-y-4">{renderMenu(sidebarData)}</ul>
    </div>
  );
};

export default Sidebar;
