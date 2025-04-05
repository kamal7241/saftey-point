import { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (

    <html lang="en">
      <body className={`dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
