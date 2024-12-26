"use client";
import React from "react";
import { ChevronDown } from "../ui/icons/ChevronDown";

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
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  value,
  options,
  onChange,
  placeholder = label,
  extraClass = "px-3 py-3.5",
}) => {
  return (
    <div>
      {label && (
        <label className="inputLabel">
          {label}
        </label>
      )}
      <div className="relative">
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
      </div>
    </div>
  );
};

export default SelectField;
