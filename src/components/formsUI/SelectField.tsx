"use client";
import React, { useState } from "react";
import { ChevronDown } from "../ui/icons/ChevronDown";
import Image from "next/image";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  options: Option[];
  onChange: (name: string, value: string) => void;
  extraClass?: string;
  customDropdown?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  value,
  options,
  onChange,
  placeholder = label,
  extraClass = "px-3 py-0 leading-[50px]",
  customDropdown = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (optionValue: string) => {
    onChange(name, optionValue);
    setIsOpen(false);
  };
  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder;

  return (
    <div>
      {label && <label className="inputLabel">{label}</label>}
      <div className="relative">
        {customDropdown ? (
          <div
            className={`border rounded-lg w-full ${extraClass} cursor-pointer`}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <div className="flex justify-between items-center">
              <span>{selectedLabel}</span>
              <span className="inline-block text-gray-900 w-4 absolute end-2 top-1/2 -translate-y-1/2">
                <ChevronDown />
              </span>
            </div>
          </div>
        ) : (
          <>
            <select
              name={name}
              value={value}
              onChange={(e) => onChange(name, e.target.value)}
              className={`border rounded-lg w-full appearance-none cursor-pointer outline-none ${extraClass}`}
            >
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="inline-block text-gray-900 w-4 absolute end-2 top-1/2 -translate-y-1/2">
              <ChevronDown />
            </span>
          </>
        )}

        {customDropdown && isOpen && (
          <ul className="absolute z-10 w-full border border-gray-400 rounded-lg py-4 bg-white shadow-md mt-1 overflow-hidden">
            {options.map((option) => (
              <li
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer gap-2.5 text-gray-600"
                onClick={() => handleOptionClick(option.value)}
              >
                <input
                  type="checkbox"
                  checked={value === option.value}
                  readOnly
                  className="peer hidden"
                />
                <Image
                  src="/images/icons/checkbox.svg"
                  className="peer-checked:hidden"
                  width="16"
                  height="16"
                  alt=""
                />
                <Image
                  src="/images/icons/checkbox_checked.svg"
                  className="hidden peer-checked:block"
                  width="16"
                  height="16"
                  alt=""
                />
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelectField;
