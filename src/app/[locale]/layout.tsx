import type { Metadata } from "next";
import { Cairo, Jost } from "next/font/google";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";

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
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "manifest", url: "/favicon/site.webmanifest" }],
  },
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
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        className={`antialiased ${
          locale === "ar" ? fontAr.className : fontEn.className
        }`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <div suppressHydrationWarning>
            <Toaster
              position="top-right"
              toastOptions={{
                className: "",
                style: {
                  zIndex: 9999,
                },
              }}
            />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              newestOnTop
              closeOnClick
              rtl={direction === "rtl"}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
