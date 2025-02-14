import React from "react";
import RadioUnCheck from "../ui/icons/RadioUnCheck";
import RadioCheck from "../ui/icons/RadioCheck";

interface RadioFieldProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioField: React.FC<RadioFieldProps> = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="col-span-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-4 mt-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer w-2/5"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={onChange}
              className="hidden peer"
            />
            <span className="w-6 inline-block peer-checked:hidden text-gray-300 peer-checked:text-primary">
              <RadioUnCheck />
            </span>
            <span className="w-6 hidden peer-checked:inline-block text-gray-300 peer-checked:text-primary">
              <RadioCheck />
            </span>
            <span className="text-gray-300 peer-checked:text-primary">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioField;
