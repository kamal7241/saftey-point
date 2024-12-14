import { useState, useEffect, useRef } from "react";
import LanguageSwitcher from "./HeaderActions/LanguageSwitcher";
import Notifications from "./HeaderActions/Notifications";
import UserMenu from "./HeaderActions/UserMenu";
import Image from "next/image";
// import UserMenu from "./UserMenu";

const HeaderActions = () => {
  const [activeMenu, setActiveMenu] = useState<"language" | "notifications" | "user" | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false); // Track fullscreen state

  const handleMenuToggle = (menu: "language" | "notifications" | "user") => {
    setActiveMenu(activeMenu === menu ? null : menu); // Close if it's already open, otherwise open it
  };
  
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        !languageMenuRef.current?.contains(e.target as Node) &&
        !notificationsMenuRef.current?.contains(e.target as Node) &&
        !userMenuRef.current?.contains(e.target as Node)
      ) {
        setActiveMenu(null); // Close all menus if clicked outside
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true); // Set fullscreen state to true
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false); // Set fullscreen state to false
      }
    }
  };

  return (
    <div className="header-actions flex items-center gap-4">
      <LanguageSwitcher
        isOpen={activeMenu === "language"}
        onToggle={() => handleMenuToggle("language")}
        ref={languageMenuRef}
      />
      <Notifications
        isOpen={activeMenu === "notifications"}
        onToggle={() => handleMenuToggle("notifications")}
        ref={notificationsMenuRef}
      />
      <UserMenu
        isOpen={activeMenu === "user"}
        onToggle={() => handleMenuToggle("user")}
        ref={userMenuRef}
      />
      <div className="relative">
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
    </div>
  );
};

export default HeaderActions;
