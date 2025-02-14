import { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const ImageWithFallback = ({
  src,
  alt,
  className,
  width = 30,
  height = 30,
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className || "w-10 h-10 object-cover rounded-full"}
      width={width}
      height={height}
      onError={() => setImgSrc("/images/noimage.webp")}
    />
  );
};

export default ImageWithFallback;
