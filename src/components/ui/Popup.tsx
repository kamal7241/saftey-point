import React, { useRef, useEffect, useCallback } from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, children }) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleOverlayClick = useCallback(
    (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOverlayClick);
    } else {
      document.removeEventListener("click", handleOverlayClick);
    }

    return () => {
      document.removeEventListener("click", handleOverlayClick);
    };
  }, [isOpen, handleOverlayClick]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div ref={popupRef} className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl mb-4">{title}</h2>
        <div>{children}</div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
