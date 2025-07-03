"use client";

import { useNavigationLoading } from "@/hooks/useNavigationLoading";
import { useLoading } from "@/contexts/LoadingProvider";
import { useEffect } from "react";

const NavigationLoader = () => {
  const { resetLoading } = useLoading();
  
  // Use the navigation loading hook
  useNavigationLoading();
  
  // Reset loading state on component mount to handle any stuck states
  useEffect(() => {
    console.log('NavigationLoader mounted, resetting any stuck loading states');
    resetLoading();
  }, [resetLoading]);

  return null;
};

export default NavigationLoader; 