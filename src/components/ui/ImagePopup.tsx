import { useState } from "react";
import Popup from "./Popup";
import Image from "next/image";
import Eye from "./icons/Eye";
import ImageWithFallback from "./ImageWithFallback";
import { useTranslations } from "next-intl";

interface ImagePopupProps {
  imagePath?: string;
  label?: string;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ imagePath }) => {
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => !hasError && setIsOpen(true)}>
        <button className={`flex items-center gap-2 relative group justify-center rounded-full overflow-hidden ${hasError ? 'cursor-not-allowed opacity-50' : ''}`}>
          <span className="size-11 relative">
            <ImageWithFallback
              src={`${process.env.NEXT_PUBLIC_URL}/${imagePath}`}
              alt="Preview"
              className="object-cover m-auto"
              fill
              onError={handleImageError}
            />
          </span>
          {!hasError && (
            <span className="group-hover:opacity-100 inset-0 absolute flex items-center justify-center bg-black-100 bg-opacity-50 opacity-0 text-white">
              <Eye />
            </span>
          )}
        </button>
        <span className={`text-blue-400 underline ${hasError ? 'opacity-50' : ''}`}>
          {t('view_image')}
        </span>
      </div>
      {!hasError && (
        <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="relative aspect-square overflow-hidden">
            {imagePath ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_URL || ""}${imagePath?.startsWith("/") ? "" : "/"}${imagePath}`}
                alt="Preview"
                className="object-contain m-auto"
                fill
                onError={handleImageError}
              />
            ) : (
              <p className="text-gray-500">No image available</p>
            )}
          </div>
        </Popup>
      )}
    </div>
  );
};

export default ImagePopup;
