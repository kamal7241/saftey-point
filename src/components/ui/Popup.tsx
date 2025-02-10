"use client";
import React, { useRef } from "react";
import { Close } from "./icons/Close";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      onClose(); // Close only if the click is outside the popup content
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black-400 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick} // Attach click handler to the overlay
    >
      <div
        ref={popupRef}
        className="bg-white p-6 rounded-lg max-w-[640px] w-full relative max-h-screen overflow-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside popup from bubbling to overlay
      >
        <div>{children}</div>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center absolute top-2 end-2 group/button"
        >
          <span className="w-3.5 text-gray-301 group-hover/button:rotate-90 transition-all">
            <Close />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Popup;
