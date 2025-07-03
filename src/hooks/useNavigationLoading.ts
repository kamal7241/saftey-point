import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingProvider';

export const useNavigationLoading = () => {
  const pathname = usePathname();
  const { setNavigating } = useLoading();
  const previousPathname = useRef(pathname);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set loading if the pathname actually changed
    if (previousPathname.current !== pathname) {
      console.log('Navigation started:', previousPathname.current, '->', pathname);
      
      // Set loading when pathname changes
      setNavigating(true);
      
      // Clear loading after a delay to allow page data to load
      timeoutRef.current = setTimeout(() => {
        console.log('Navigation timeout completed, stopping loading');
        setNavigating(false);
      }, 2000); // Increased delay to account for data fetching

      previousPathname.current = pathname;
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname, setNavigating]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return null;
}; 