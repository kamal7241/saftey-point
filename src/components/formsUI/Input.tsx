"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { InputProps } from "@/types/input";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VisibilityOff from "@/components/ui/icons/VisibilityOff";
import Visibility from "@/components/ui/icons/Visibility";
import { useTranslations } from "next-intl";

type DateRange = [Date | null, Date | null];
type TimeRange = { from: Date | null; to: Date | null };

type CustomInputProps = InputProps & { 
  range?: boolean; 
  timeRange?: boolean;
  min?: number;
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
  min,
}) => {
  const t = useTranslations("ui");
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

  useEffect(() => {
    if (type === "date" && range && Array.isArray(value) && value.length === 2) {
      const newStartDate = value[0] instanceof Date ? value[0] : (value[0] ? new Date(value[0]) : null);
      const newEndDate = value[1] instanceof Date ? value[1] : (value[1] ? new Date(value[1]) : null);
      if (newStartDate?.getTime() !== dateRange[0]?.getTime() || newEndDate?.getTime() !== dateRange[1]?.getTime()) {
        setDateRange([newStartDate, newEndDate]);
      }
    }
  }, [value, type, range, dateRange]);
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

        {type === "date" && range ? (
          <DatePicker
            selected={dateRange[0]}
            onChange={handleDateChange}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            selectsRange
            placeholderText={placeholder || t("select_date_range")}
            className="w-full border-none outline-none placeholder:text-gray-800 placeholder:text-opacity-30 leading-[50px]"
            calendarClassName="w-full"
          />
        ) : type === "date" ? (
          <DatePicker
            selected={value ? new Date(value as string) : null}
            onChange={(date) => onChange?.(date?.toISOString() || '')}
            placeholderText={placeholder || t("select_date")}
            className="w-full border-none outline-none placeholder:text-gray-800 placeholder:text-opacity-30 leading-[50px]"
            dateFormat="yyyy-MM-dd"
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
              timeCaption={t("from")}
              dateFormat="HH:mm"
              placeholderText={t("from")}
              className="w-full border-none outline-none placeholder:text-gray-800 placeholder:text-opacity-30 leading-[50px]"
            />

            {/* Time To */}
            <DatePicker
              selected={timeTo}
              onChange={(time) => handleTimeChange(time, "to")}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption={t("to")}
              dateFormat="HH:mm"
              placeholderText={t("to")}
              className="w-full border-none outline-none placeholder:text-gray-800 placeholder:text-opacity-30 leading-[50px]"
            />
          </div>
        ) : (
          <input
            type={isPasswordVisible && type === "password" ? "text" : type}
            placeholder={placeholder}
            required={required}
            value={Array.isArray(value) ? "" : (value ?? "")}
            onChange={(e) => onChange?.(e)}
            name={name}
            readOnly={readOnly}
            onKeyDown={onKeyDown}
            min={min}
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
