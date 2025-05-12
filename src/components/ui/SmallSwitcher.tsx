import React from "react";

interface SwitcherProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

const Switcher = ({ isChecked, onChange }: SwitcherProps) => {
  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    onChange(newCheckedState);
  };

  return (
    <label className="relative inline-flex cursor-pointer select-none items-center">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="sr-only"
      />
      <span
        className={`flex h-6 w-[36px] items-center rounded-full px-1 py-2 duration-200 ${
          isChecked ? "bg-black-400" : "bg-gray-900"
        }`}
      >
        <span
          className={`w-2/4 aspect-square rounded-full bg-white duration-200 ${
            isChecked ? "ltr:translate-x-full rtl:-translate-x-full" : ""
          }`}
        ></span>
      </span>
    </label>
  );
};

export default Switcher;
