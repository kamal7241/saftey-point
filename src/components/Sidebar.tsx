"use client";

import { useState, useEffect, useCallback } from "react";
import { Link, usePathname } from "@/i18n/routing";
import sidebarData from "@/sidebarData.json";
import Image from "next/image";
import { ArrowDown } from "./ui/icons/ArrowDown";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/UserProvider";
import { useLoading } from "@/contexts/LoadingProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser,
  faGear,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";

type SidebarItem = {
  name: string;
  link: string;
  children?: SidebarItem[];
  icon?: string;
  activeIcon?: string;
  comingSoon?: boolean;
  roles?: string[]; // Add roles property
};

const toTranslationKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");

// Font Awesome icon mapping
const fontAwesomeIcons: Record<string, IconDefinition> = {
  faUser,
  faGear,
};

const Sidebar = () => {
  const t = useTranslations("nav");
  const pathname = usePathname() as string;
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const { getPrimaryRole } = useAuth();
  const { isNavigating, isPageLoading } = useLoading();
  const currentUserRole = getPrimaryRole() ?? "";

  const filterByRole = (items: SidebarItem[], role: string): SidebarItem[] => {
    return items
      .filter(item => item.roles && item.roles.includes(role))
      .map(item => ({
        ...item,
        children: item.children ? filterByRole(item.children, role) : undefined,
      }));
  };

  // Get role-specific sidebar data
  let roleSpecificSidebarData = filterByRole(sidebarData as SidebarItem[], currentUserRole);

  // If no role-specific items found, show all items (fallback)
  if (roleSpecificSidebarData.length === 0) {
    console.log('No role-specific sidebar items found for role:', currentUserRole, 'Showing all items as fallback');
    roleSpecificSidebarData = sidebarData as SidebarItem[];
  }

  const translatedSidebarData = roleSpecificSidebarData.map((item: SidebarItem) => ({
    ...item,
    name: t(toTranslationKey(item.name)),
    children: item.children?.map((child) => ({
      ...child,
      name: t(toTranslationKey(child.name)),
    })),
  }));

  const isActive = useCallback((link: string) => {
    if (link === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(link);
  }, [pathname]);

  useEffect(() => {
    const activeItem = translatedSidebarData.find((item: SidebarItem) =>
      item.children?.some((child) => isActive(child.link))
    );

    // Only set open item if it's a top-level item with children
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
          {item.icon.startsWith('fa') ? (
            // Font Awesome icon
            <FontAwesomeIcon 
              icon={fontAwesomeIcons[item.icon]} 
              className={`w-5 h-5 duotone-icon ${active || isParentActive ? "duotone-primary" : "duotone-secondary"}`}
            />
          ) : (
            // Image icon
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
          )}
        </span>
      )}
      <span className="whitespace-nowrap capitalize">{item.name}</span>
      {(isNavigating || isPageLoading) && active && (
        <div className="ml-auto">
          <div className="w-4 h-4 border-2 border-t-2 border-gray-300 border-solid rounded-full animate-spin border-t-primary"></div>
        </div>
      )}
    </>
  );

  const renderMenu = (items: SidebarItem[]) => {
    return items.map((item) => {
      const active = isActive(item.link);
      const isParentActive = !!item.children?.some((child) =>
        isActive(child.link)
      );

      const isOpen = openItems[item.name] ?? false;
      const isComingSoon = item.comingSoon;
      return (
        <li key={item.name} className="relative whitespace-nowrap">
          {item.children && item.children.length > 0 ? (
            <button
              onClick={() => toggleItem(item.name)}
              className={`w-full flex items-center px-2 py-2 text-balance font-medium rounded-md gap-3 ${active || isParentActive ? "text-primary" : ""
                }`}
            >
              {renderMenuItem(item, active, isParentActive)}
              <span
                className={`${(openItem === item.name || isOpen) ? "rotate-180" : ""
                  } ms-auto`}
              >
                <ArrowDown />
              </span>
            </button>
          ) : isComingSoon ? (
            <div
              className="w-full flex items-center px-2 py-2 text-balance font-medium rounded-md gap-1 cursor-not-allowed opacity-60 text-xs"
              title="Coming Soon"
            >
              {renderMenuItem(item, false, false)}
              <span className="ms-2 text-[10px] bg-gray-200 rounded px-2 py-0.5 whitespace-nowrap">{t("coming_soon")}</span>
            </div>
          ) : (
            <Link
              href={item.link}
              className={`w-full flex items-center px-2 py-2 text-balance font-medium rounded-md gap-3 ${active ? "bg-primary text-white" : "text-gray-600"
                }`}
            >
              {renderMenuItem(item, active, isParentActive)}
            </Link>
          )}
          {item.children && (openItem === item.name || isOpen) && (
            <ul className="py-4 pl-6">{renderMenu(item.children)}</ul>
          )}
        </li>
      );
    });
  };

  // Debug logging
  console.log('Sidebar - Current user role:', currentUserRole);
  console.log('Sidebar - Role-specific items count:', roleSpecificSidebarData.length);
  console.log('Sidebar - Translated items count:', translatedSidebarData.length);
  console.log('Sidebar - All sidebar data count:', sidebarData.length);
  console.log('Sidebar - Available roles in data:', [...new Set(sidebarData.flatMap(item => item.roles || []))]);

  // If no items are found at all, show a fallback message
  if (translatedSidebarData.length === 0) {
    console.warn('Sidebar - No items found to display');
    return (
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="text-center text-gray-500">
          <p>No menu items available for your role.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full bg-white p-4">
      <nav className="space-y-2">
        <ul className="space-y-1">{renderMenu(translatedSidebarData)}</ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
