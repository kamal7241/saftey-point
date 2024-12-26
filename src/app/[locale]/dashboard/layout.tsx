import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { Link } from "@/i18n/routing";
import Image from "next/image";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <ProtectedRoute>
      <div className="dashboard-layout flex min-h-svh">
        <nav className="w-[312px] bg-white shadow-custom px-5 flex-shrink-0 overflow-hidden fixed top-0 start-0 z-40 h-screen transition-transform -translate-x-full sm:translate-x-0">
          <div className="flex flex-col justify-start h-full w-full">
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
        <main className="w-[calc(100vw-312px)] ms-[312px] bg-gray-500 relative pt-[90px] flex-col flex">
          <div className="absolute left-0 right-0 top-0">
            <Header />
          </div>
          {children}
          <div className="mt-auto">
            <Footer />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
