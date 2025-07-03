import { useEffect, useRef } from 'react';
import { useLoading } from '@/contexts/LoadingProvider';

export const usePageLoading = (isLoading: boolean) => {
  const { setPageLoading } = useLoading();
  const previousLoadingState = useRef(isLoading);

  useEffect(() => {
    // Only update if the loading state actually changed
    if (previousLoadingState.current !== isLoading) {
      console.log('Page loading state changed:', previousLoadingState.current, '->', isLoading);
      setPageLoading(isLoading);
      previousLoadingState.current = isLoading;
    }
  }, [isLoading, setPageLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Page loading hook unmounting, resetting loading state');
      setPageLoading(false);
    };
  }, [setPageLoading]);
}; 