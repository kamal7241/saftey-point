import React from "react";

interface TogglerProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
}

const Toggler: React.FC<TogglerProps> = ({ checked, onChange, disabled, className }) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    className={`w-[27px] h-[20px]  rounded-full flex items-center justify-center transition-colors
      ${checked ? "bg-primary" : "bg-gray-600"}
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${className}
    `}
    aria-pressed={checked}
  >
    <span
      className={`block size-3 rounded-full transition-all relative
        ${checked ? "bg-white left-1" : "bg-white -left-1"}
      `}
    />
  </button>
);

export default Toggler;
