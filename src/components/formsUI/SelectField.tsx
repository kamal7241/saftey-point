"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown } from "../ui/icons/ChevronDown";
import Image from "next/image";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    const filtered = options.filter((option) => {
      if (!option?.label) return false;
      if (!searchTerm) return true;
      return option.label.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  const handleOptionClick = (optionValue: string) => {
    onChange(name, optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedLabel = options.find((option) => option.value === value)?.label || placeholder;

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
              <span className="capitalize">{selectedLabel}</span>
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
                <option key={option.value} value={option.value} disabled={option.disabled}>
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
          <div className="absolute z-10 w-full border border-gray-400 rounded-lg bg-white shadow-md mt-1 overflow-hidden">
            {options.length > 5 && (
              <div className="p-2 border-b">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary placeholder:text-black-100"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <ul className="py-2 overflow-y-auto max-h-[180px]">
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-gray-500 text-center">No results found</li>
              ) : (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`flex items-center px-3 py-2 gap-2.5 text-gray-600 ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}
                    onClick={() => !option.disabled && handleOptionClick(option.value)}
                    aria-disabled={option.disabled}
                  >
                    <input
                      type="checkbox"
                      checked={value === option.value}
                      readOnly
                      className="peer hidden"
                      disabled={option.disabled}
                    />
                    <Image
                      src="/images/icons/checkbox.svg"
                      className={`${value === option.value ? 'hidden' : 'block'}`}
                      width="16"
                      height="16"
                      alt=""
                    />
                    <Image
                      src="/images/icons/checkbox_checked.svg"
                      className={`${value === option.value ? 'block' : 'hidden'}`}
                      width="16"
                      height="16"
                      alt=""
                    />
                    {option.label}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectField;
