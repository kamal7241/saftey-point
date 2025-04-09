"use client";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <>
      <ProtectedRoute>
        <div className="dashboard-layout flex h-svh">
          <nav className="fixed start-0 top-0 z-40 h-screen w-[312px] flex-shrink-0 -translate-x-full overflow-hidden bg-white px-5 shadow-custom transition-transform sm:translate-x-0">
            <div className="flex h-full w-full flex-col justify-start">
              <div className="flex justify-center">
                <Link href={"/dashboard"}>
                  <Image
                    className="mb-4"
                    src="/images/logo/logo.webp"
                    alt="Logo"
                    width="138"
                    height="158"
                  />
                </Link>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-auto">
                <Sidebar />
              </div>
            </div>
          </nav>
          <main className="relative ms-[312px] flex h-full w-[calc(100vw-312px)] flex-col overflow-y-scroll bg-gray-500 pt-[90px]">
            <div className="absolute left-0 right-0 top-0">
              <Header />
            </div>
            <div className="flex flex-col items-stretch px-6 pt-4">
              <div className="h-full">{children}</div>
            </div>
            <div className="mt-auto pt-6">
              <Footer />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
}
