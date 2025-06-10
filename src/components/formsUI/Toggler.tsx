import React from "react";

interface TogglerProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const Toggler: React.FC<TogglerProps> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    className={`w-[20px] h-[12px]  rounded-full flex items-center justify-center transition-colors
      ${checked ? "bg-primary" : "bg-gray-600"}
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    `}
    aria-pressed={checked}
  >
    <span
      className={`block w-2 h-2 rounded-full transition-all relative
        ${checked ? "bg-white left-1" : "bg-white -left-1"}
      `}
    />
  </button>
);

export default Toggler;
