import React, { FC } from "react";
import Dropdown from "../ui/Dropdown";

type NotificationsProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const Notifications: FC<NotificationsProps> = ({ isOpen, onToggle }) => {
  const menuItems = (
    <>
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
        Notification 1
      </li>
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
        Notification 2
      </li>
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
        Notification 3
      </li>
    </>
  );

  return (
    <Dropdown
      isOpen={isOpen}
      onToggle={onToggle}
      iconSrc="/images/icons/notification.svg"
      altText="Notifications"
      menuItems={menuItems}
      width="w-64"
    />
  );
};

export default Notifications;
