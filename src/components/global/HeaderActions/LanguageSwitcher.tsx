import { ArrowDown } from "@/components/ui/icons/ArrowDown";
import { redirect, usePathname } from "@/i18n/routing";
import Image from "next/image";
import React, { FC, ReactNode } from "react";
import Dropdown from "../ui/Dropdown";
import { useLocale } from "use-intl";

type LanguageSwitcherProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ isOpen, onToggle }) => {
  const locale = useLocale();
  const pathname = usePathname();

  const changeLanguage = (language: string) => {
    if (language !== locale) {
      redirect({ href: pathname, locale: language });
    }
  };

  const menuItems: ReactNode = (
    <>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flexCenter"
        onClick={() => changeLanguage("en")}
      >
        <Image
          src="/images/icons/en.svg"
          alt="English"
          width={24}
          height={24}
        />
        English
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flexCenter"
        onClick={() => changeLanguage("ar")}
      >
        <Image
          src="/images/icons/egypt.svg"
          alt="Arabic"
          width={24}
          height={24}
        />
        العربية
      </li>
    </>
  );

  return (
    <Dropdown
      isOpen={isOpen}
      onToggle={onToggle}
      iconSrc={
        locale === "en" ? "/images/icons/en.svg" : "/images/icons/egypt.svg"
      }
      altText="Language"
      menuItems={menuItems}
      buttonContent={
        <div className="flexCenter">
          <span>{locale === "en" ? "English" : "العربية"}</span>
          <ArrowDown />
        </div>
      }
      width="w-40"
    />
  );
};

export default LanguageSwitcher;
