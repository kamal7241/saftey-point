"use client";
import { useRouter } from "@/i18n/routing";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = !!Cookies.get("accessToken");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authentication/login");
    }
  }, [isAuthenticated, router]);
  

  if (isAuthenticated === null) {
    return null; // Or return a loading spinner, or some fallback UI
  }

  return <>{isAuthenticated && children}</>;
}
