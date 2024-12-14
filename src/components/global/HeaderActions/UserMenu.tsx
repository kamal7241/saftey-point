import Image from "next/image";
import React, { forwardRef } from "react";

const UserMenu = forwardRef<HTMLDivElement, { isOpen: boolean, onToggle: () => void }>(
  ({ isOpen, onToggle }, ref) => {
    return (
      <div className="relative" ref={ref}>
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={onToggle}
        >
          <Image
            src="/images/icons/user.svg"
            alt="User"
            width={24}
            height={24}
          />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded-md z-10">
            <ul>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
            </ul>
          </div>
        )}
      </div>
    );
  }
);

UserMenu.displayName = "UserMenu";

export default UserMenu;
