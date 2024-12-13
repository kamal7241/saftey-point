// src/components/Input.tsx

import React, { useState } from 'react';
import { InputProps } from '@/types/input';


const Input: React.FC<InputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
  icon,
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
      <label className="text-dark mb-1.5 block text-sm font-medium">{label}</label>
      <div className="flex items-center justify-start gap-2 overflow-hidden rounded-lg border border-gray-200 px-3 py-3.5">
        {icon && <img src={icon} alt="icon" className="nav-icon" width="20" />}
        <input
          type={isPasswordVisible && type === 'password' ? 'text' : type}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          name={name}
          className="w-full border-none outline-none"
        />
        {type === 'password' && (
          <button type="button" onClick={handlePasswordToggle}>
            {isPasswordVisible ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
