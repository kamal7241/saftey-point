import { useState } from "react";
import Image from "next/image";

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
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className || "w-10 h-10 object-cover rounded-full"}
      {...(!fill && { width, height })}
      fill={fill}
      onError={() => {
        setImgSrc("/images/noimage.webp");
        onError?.();
      }}
    />
  );
};

export default ImageWithFallback;
