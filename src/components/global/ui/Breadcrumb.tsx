import { Link } from "@/i18n/routing";
import React from "react";

type BreadcrumbProps = {
  items: { label: string; href: string }[];
};

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="h-6 justify-start items-center gap-2.5 inline-flex">
      <ul className="flex items-center">
        {items.map((item, index) => (
          <li key={index} className={`flex items-center gap-2.5 ${index > 0 ? 'ms-2.5' : ''}`}>
            <Link
              href={item.href}
              className={`text-sm font-normal leading-normal whitespace-nowrap capitalize ${
                index === items.length - 1 ? "text-gray-200 pointer-events-none" : "text-gray-300"
              }`}
            >
              {item.label}
            </Link>
            {index < items.length - 1 && (
              <span className="text-gray-300">/</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb;