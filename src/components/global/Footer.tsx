import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

export default function Footer() {
  const t = useTranslations('common');
  return (
    <footer className="px-6 py-1.5 bg-white shadow-custom3">
      <div className="flex items-center justify-between">
        <div className="flexCenter">
          <Image
            src="/images/logo/sm-logo.webp"
            width={18}
            height={18}
            alt="sm logo"
          />
          <span className="text-gray-300 text-sm">
            {t('copyright', { year: new Date().getFullYear() })}
          </span>
        </div>
        <ul className="flex items-center justify-center gap-2 textRegular">
          <li>
            <Link href="/about" className="hover:underline">{t("about")}</Link>
          </li>
          <li>{" - "}</li>
          <li>
            <Link href="/support" className="hover:underline">{t("support")}</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
