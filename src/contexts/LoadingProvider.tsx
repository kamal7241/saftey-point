"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

interface LoadingContextType {
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
  isNavigating: boolean;
  setNavigating: (loading: boolean) => void;
  resetLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setPageLoading = (loading: boolean) => {
    console.log('LoadingProvider: setPageLoading', loading);
    setIsPageLoading(loading);
    
    // Set safety timeout when loading starts
    if (loading) {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
      safetyTimeoutRef.current = setTimeout(() => {
        console.log('LoadingProvider: Safety timeout triggered, resetting page loading');
        setIsPageLoading(false);
      }, 10000); // 10 second safety timeout
    } else {
      // Clear safety timeout when loading stops
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    }
  };

  const setNavigating = (loading: boolean) => {
    console.log('LoadingProvider: setNavigating', loading);
    setIsNavigating(loading);
    
    // Set safety timeout when navigation starts
    if (loading) {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
      safetyTimeoutRef.current = setTimeout(() => {
        console.log('LoadingProvider: Safety timeout triggered, resetting navigation');
        setIsNavigating(false);
      }, 10000); // 10 second safety timeout
    } else {
      // Clear safety timeout when navigation stops
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    }
  };

  const resetLoading = () => {
    console.log('LoadingProvider: resetLoading called');
    setIsPageLoading(false);
    setIsNavigating(false);
    
    // Clear any safety timeout
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ 
      isPageLoading, 
      setPageLoading, 
      isNavigating, 
      setNavigating,
      resetLoading
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}; 