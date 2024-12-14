import { ArrowDown } from "@/components/ui/icons/ArrowDown";
import { redirect, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { forwardRef } from "react";
import { useLocale } from "use-intl";

const LanguageSwitcher = forwardRef<
  HTMLDivElement,
  { isOpen: boolean; onToggle: () => void }
>(({ isOpen, onToggle }, ref) => {
  const locale = useLocale();
  const pathname = usePathname();

  const changeLanguage = async (language: string) => {
    console.log("language", language);
    if (language !== locale) {
      const newPath = pathname.replace(/^\/(ar|en)/, "");
      const finalPath =
        language === "en" ? `/${newPath}` : `/${language}${newPath}`;

      console.log("finalPath", finalPath);
      // Update the route to reflect the new language
      redirect({ href: `${newPath}`, locale: language });
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button className="flex items-center gap-2" onClick={onToggle}>
        <Image
          src={
            locale === "en" ? "/images/icons/en.svg" : "/images/icons/egypt.svg"
          }
          alt="Language"
          width={24}
          height={24}
          className="rounded-full"
        />
        <span>{locale === "en"?"English":"العربية "}</span>
        <span className="ms-auto">
        <ArrowDown/>
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded-md z-10">
          <ul>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => changeLanguage("en")}
            >
              <Image
                src={"/images/icons/en.svg"}
                alt="Language"
                width={24}
                height={24}
              />
              English
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => changeLanguage("ar")}
            >
              <Image
                src={"/images/icons/egypt.svg"}
                alt="Language"
                width={24}
                height={24}
                className="rounded-full"
              />
              Arabic
            </li>
          </ul>
        </div>
      )}
    </div>
  );
});

LanguageSwitcher.displayName = "LanguageSwitcher";

export default LanguageSwitcher;
