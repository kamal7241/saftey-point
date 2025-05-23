import React, { FC } from "react";
import Dropdown from "../ui/Dropdown";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";

type UserMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const UserMenu: FC<UserMenuProps> = ({ isOpen, onToggle }) => {
  const t = useTranslations("ui");
    const handleLogout = () => {
      // Clear authentication tokens
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
  
      // Redirect to login page
      window.location.href = "/login";
    };
  const menuItems = (
    <>
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{t("profile")}</li>
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{t("settings")}</li>
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>{t("logout")}</li>
    </>
  );

  return (
    <Dropdown
      isOpen={isOpen}
      onToggle={onToggle}
      iconSrc="/images/icons/user.svg"
      altText="User"
      menuItems={menuItems}
    />
  );
};

export default UserMenu;
