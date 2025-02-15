"use client";
import React, { useEffect, useRef } from "react";
import { Close } from "./icons/Close";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  // const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
  //     onClose();
  //   }
  // };

  useEffect(() => {
    const handleEscPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscPress);
    }
    return () => {
      window.removeEventListener("keydown", handleEscPress);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black-400 bg-opacity-50"
      // onClick={handleOverlayClick}
    >
      <div
        ref={popupRef}
        className="relative max-h-screen w-full max-w-[640px] overflow-auto rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div>{children}</div>
        <button
          onClick={onClose}
          className="group/button absolute end-2 top-2 flex h-9 w-9 items-center justify-center"
        >
          <span className="w-3.5 text-gray-301 transition-all group-hover/button:rotate-90">
            <Close />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Popup;
