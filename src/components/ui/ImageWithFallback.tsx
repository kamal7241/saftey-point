import { useState } from "react";
import Image from "next/image";
import { constructImageUrl, isValidUrl, getFallbackImageUrl } from "@/utils/urlUtils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  onError?: () => void;
}

const ImageWithFallback = ({
  src,
  alt,
  className,
  width = 30,
  height = 30,
  fill = false,
  onError,
}: ImageWithFallbackProps) => {
  // Validate and sanitize the src URL
  const getValidSrc = (url: string) => {
    // Use the utility function to construct a valid URL
    if (url.includes('undefined') || !isValidUrl(url)) {
      return getFallbackImageUrl();
    }
    
    // If it's already a relative path or absolute URL, use it as is
    if (url.startsWith('/') || url.startsWith('http')) {
      return url;
    }
    
    // Use the utility function for constructing URLs with base URL
    return constructImageUrl(url);
  };

  // Handle localhost URLs specifically for development
  const handleLocalhostUrl = (url: string) => {
    if (url.includes('localhost:4444')) {
      // For development, we'll allow localhost URLs
      return url;
    }
    return url;
  };

  const [imgSrc, setImgSrc] = useState(handleLocalhostUrl(getValidSrc(src)));
  
  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className || "w-10 h-10 object-cover rounded-full"}
      {...(!fill && { width, height })}
      fill={fill}
      unoptimized={imgSrc.includes('localhost')} // Disable optimization for localhost URLs
      onError={() => {
        setImgSrc(getFallbackImageUrl());
        onError?.();
      }}
    />
  );
};

export default ImageWithFallback;
