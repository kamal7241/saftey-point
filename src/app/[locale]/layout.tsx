import type { Metadata } from "next";
import { Cairo, Jost } from "next/font/google";

import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const fontEn = Jost({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const fontAr = Cairo({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Safety Points Academy Dashboard",
  description: "Safety Points Academy Dashboard app",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <body
        className={`antialiased ${
          locale === "ar" ? fontAr.className : fontEn.className
        }`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
