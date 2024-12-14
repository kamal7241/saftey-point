import Image from "next/image";
import React, { forwardRef } from "react";

const Notifications = forwardRef<HTMLDivElement, { isOpen: boolean, onToggle: () => void }>(
  ({ isOpen, onToggle }, ref) => {
    return (
      <div className="relative" ref={ref}>
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={onToggle}
        >
          <Image
            src="/images/icons/notification.svg"
            alt="Notifications"
            width={24}
            height={24}
          />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border shadow-md rounded-md z-10">
            <ul>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Notification 1</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Notification 2</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Notification 3</li>
            </ul>
          </div>
        )}
      </div>
    );
  }
);

Notifications.displayName = "Notifications";

export default Notifications;
