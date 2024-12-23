import React, { useState } from "react";

const Switcher = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <label className="relative inline-flex cursor-pointer select-none items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <span
          className={`flex h-3 w-[15px] items-center rounded-full p-1 duration-200 ${
            isChecked ? "bg-black" : "bg-gray-900"
          }`}
        >
          <span
            className={`w-3/4 aspect-square rounded-full bg-white duration-200 ${
              isChecked ? "translate-x-1/2" : ""
            }`}
          ></span>
        </span>
      </label>
    </>
  );
};

export default Switcher;
