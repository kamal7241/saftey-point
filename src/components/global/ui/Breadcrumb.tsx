import React from "react";

type BreadcrumbProps = {
  items: { label: string; href: string }[]; // Array of objects with 'label' and 'href'
};

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="h-6 justify-start items-center gap-2.5 inline-flex">
      <ul className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2.5">
            <a
              href={item.href}
              className={`text-sm font-normal leading-normal ${
                index === items.length - 1 ? "text-gray-200" : "text-gray-300"
              }`}
            >
              {item.label}
            </a>
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
