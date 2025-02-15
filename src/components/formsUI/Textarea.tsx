"use client";
import { TextareaProps } from "@/types/input";
import React, { ChangeEvent } from "react";

const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  name,
  error,
  required = true,
  extraClass = "px-3 py-3.5 h-full",
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
  };
  return (
    <div>
      {label && <label className="inputLabel">{label}</label>}
      <textarea
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={handleChange}
        name={name}
        className={`w-full outline-none placeholder:text-gray-800 placeholder:text-opacity-30 leading-[20px] flex items-center justify-start gap-2 overflow-hidden rounded-lg text-gray-300 border border-gray-200  px-3 py-3.5 h-full ${
          error ? "!border-red-400" : ""
        } ${extraClass}`}
      />
    </div>
  );
};

export default Textarea;
