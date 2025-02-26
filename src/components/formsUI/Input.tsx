"use client";

import React, { ChangeEvent, useState } from "react";
import { InputProps } from "@/types/input";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VisibilityOff from "@/components/ui/icons/VisibilityOff";
import Visibility from "@/components/ui/icons/Visibility";

type DateRange = [Date | null, Date | null];
type TimeRange = { from: Date | null; to: Date | null };

type CustomInputProps = InputProps & { 
  range?: boolean; 
  timeRange?: boolean;
  onChange?: (value: string | ChangeEvent<HTMLInputElement> | DateRange | TimeRange) => void;
};

const Input: React.FC<CustomInputProps> = ({
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
  readOnly,
  iconEnd,
  extraClass = "px-3 py-0 leading-[50px] h-full",
  togglePasswordVisibility,
  range,
  timeRange,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>([null, null]);
  const [timeFrom, setTimeFrom] = useState<Date | null>(null);
  const [timeTo, setTimeTo] = useState<Date | null>(null);

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
    if (togglePasswordVisibility) {
      togglePasswordVisibility();
    }
  };

  const handleDateChange = (dates: DateRange) => {
    setDateRange(dates);
    if (onChange) {
      onChange(dates);
    }
  };
  const handleTimeChange = (time: Date | null, field: "from" | "to") => {
    if (field === "from") {
      setTimeFrom(time);
    } else {
      setTimeTo(time);
    }
  
    if (onChange) {
      onChange({ from: field === "from" ? time : timeFrom, to: field === "to" ? time : timeTo });
    }
  };
  

  return (
    <div>
      {label && <label className="inputLabel">{label}</label>}
      <div
        className={`flex items-center gap-2 overflow-hidden rounded-lg text-gray-300 ${
          border ? "border border-gray-200" : ""
        } ${error ? "!border-red-400" : ""} ${extraClass}`}
      >
        {iconSVG && <span className={`${iconEnd ? "order-2 ms-auto" : ""}`}>{iconSVG}</span>}
        {icon && <Image src={icon} alt="icon" className="nav-icon" width={20} height={20} />}

        {/* Date Range Picker */}
        {type === "date" && range ? (
          <DatePicker
            selected={dateRange[0]}
            onChange={handleDateChange}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            selectsRange
            placeholderText={placeholder || "Select date range"}
            className="w-full border-none outline-none placeholder:text-gray-800 placeholder:text-opacity-30 leading-[50px]"
            calendarClassName="w-full"
          />
        ) : type === "time" && timeRange ? (
          <div className="flex gap-2 w-full">
            {/* Time From */}
            <DatePicker
              selected={timeFrom}
              onChange={(time) => handleTimeChange(time, "from")}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="From"
              dateFormat="HH:mm"
              placeholderText="From"
              className="w-full border-none outline-none placeholder:text-gray-800 placeholder:text-opacity-30 leading-[50px]"
            />

            {/* Time To */}
            <DatePicker
              selected={timeTo}
              onChange={(time) => handleTimeChange(time, "to")}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="To"
              dateFormat="HH:mm"
              placeholderText="To"
              className="w-full border-none outline-none placeholder:text-gray-800 placeholder:text-opacity-30 leading-[50px]"
            />
          </div>
        ) : (
          <input
            type={isPasswordVisible && type === "password" ? "text" : type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            name={name}
            readOnly={readOnly}
            onKeyDown={onKeyDown}
            className="w-full border-none outline-none placeholder:text-gray-800 placeholder:text-opacity-30 leading-[50px] appearance-none"
          />
        )}

        {type === "password" && (
          <button type="button" onClick={handlePasswordToggle} className="w-5 text-gray-300 inline-block">
            {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
