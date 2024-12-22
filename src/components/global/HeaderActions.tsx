import { useState, useEffect, useRef } from "react";
import LanguageSwitcher from "./HeaderActions/LanguageSwitcher";
import Notifications from "./HeaderActions/Notifications";
import UserMenu from "./HeaderActions/UserMenu";
import Image from "next/image";

type MenuType = "language" | "notifications" | "user" | null;

const HeaderActions = () => {
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const refs = {
    language: useRef<HTMLDivElement>(null),
    notifications: useRef<HTMLDivElement>(null),
    user: useRef<HTMLDivElement>(null),
  };

  const handleMenuToggle = (menu: MenuType) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const handleOutsideClick = (e: MouseEvent) => {
    const isClickOutside = Object.values(refs).every(
      (ref) => !ref.current?.contains(e.target as Node)
    );

    if (isClickOutside) setActiveMenu(null);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div className="header-actions flex items-center gap-4">
      <div ref={refs.language}>
        <LanguageSwitcher
          isOpen={activeMenu === "language"}
          onToggle={() => handleMenuToggle("language")}
        />
      </div>
      <div ref={refs.notifications}>
        <Notifications
          isOpen={activeMenu === "notifications"}
          onToggle={() => handleMenuToggle("notifications")}
        />
      </div>
      <div ref={refs.user}>
        <UserMenu
          isOpen={activeMenu === "user"}
          onToggle={() => handleMenuToggle("user")}
        />
      </div>
      <button
        className="p-2 rounded-full hover:bg-gray-100"
        onClick={toggleFullscreen}
      >
        <Image
          src={isFullscreen ? "/images/icons/close.svg" : "/images/icons/maximize.svg"}
          alt="Fullscreen"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};

export default HeaderActions;
