"use client";

import Dashboard from "@/components/pages/Dashboard";
import { useAuth } from "@/contexts/UserProvider";
import { useEffect } from "react";

export default function DashboardPage() {
  const { getPrimaryRole, user } = useAuth();

  useEffect(() => {
    console.log('Dashboard Page - User:', user);
    console.log('Dashboard Page - Primary Role:', getPrimaryRole());
  }, [user, getPrimaryRole]);

  return <Dashboard />;
}
