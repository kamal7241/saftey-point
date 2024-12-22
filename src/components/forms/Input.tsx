"use client";

import React, { useState } from "react";
import { InputProps } from "@/types/input";
import Image from "next/image";
import Visibility from "../ui/icons/Visibility";
import VisibilityOff from "../ui/icons/VisibilityOff";

const Input: React.FC<InputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
  error,
  icon,
  required = true,
  iconSVG,
  border = true,
  onKeyDown,
  extraClass = "px-3 py-3.5",
  togglePasswordVisibility,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
    if (togglePasswordVisibility) {
      togglePasswordVisibility();
    }
  };

  return (
    <div>
      <label className="text-dark mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div
        className={`flex items-center justify-start gap-2 overflow-hidden rounded-lg text-gray-300 ${
          border ? "border border-gray-200" : ""
        } ${error?"!border-red-400":""} ${extraClass}`}
      >
        {iconSVG && iconSVG}
        {icon && (
          <Image
            src={icon}
            alt="icon"
            className="nav-icon"
            width={20}
            height={20}
          />
        )}
        <input
          type={isPasswordVisible && type === "password" ? "text" : type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          name={name}
          onKeyDown={onKeyDown}
          className="w-full border-none outline-none placeholder:text-gray-800 placeholder:text-opacity-30"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="w-5 text-gray-300 inline-block"
          >
            {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
