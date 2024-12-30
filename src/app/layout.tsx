import { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      {children}
    </>
  );
}
