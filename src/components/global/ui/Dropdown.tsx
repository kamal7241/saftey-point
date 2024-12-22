import React, { FC, ReactNode } from "react";
import Image from "next/image";

type DropdownProps = {
  isOpen: boolean;
  onToggle: () => void;
  iconSrc: string;
  altText: string;
  menuItems: ReactNode; // List of menu items to render
  buttonContent?: ReactNode;
  width?: string; // Optional width for the dropdown menu
};

const Dropdown: FC<DropdownProps> = ({
  isOpen,
  onToggle,
  iconSrc,
  altText,
  menuItems,
  buttonContent,
  width = "w-48",
}) => {
  return (
    <div className="relative">
      <button
        className="p-2 rounded-full hover:bg-gray-100 flexCenter"
        onClick={onToggle}
      >
        <Image src={iconSrc} alt={altText} width={24} height={24} />
        {buttonContent}
      </button>
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 ${width} bg-white border shadow-md rounded-md z-10`}
        >
          <ul>{menuItems}</ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
