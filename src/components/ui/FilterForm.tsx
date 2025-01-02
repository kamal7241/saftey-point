"use client";
import React, { useState } from "react";
import Input from "../formsUI/Input";
import Button from "./Button";
import { useTranslations } from "next-intl";
import SelectField from "../formsUI/SelectField";

interface Field {
  type: "text" | "select";
  label: string;
  name: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface FilterFormProps {
  fields: Field[];
  onApply: (filters: { [key: string]: string }) => void;
  onReset: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({
  fields,
  onApply,
  onReset,
}) => {
  const t = useTranslations("common");
  const [formState, setFormState] = useState<{ [key: string]: string }>({});

  const handleChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(formState);
  };

  const handleReset = () => {
    setFormState({});
    onReset();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  return (
    <div
      className="flex items-stretch justify-between gap-6 px-4 py-6"
      onKeyDown={handleKeyPress}
      role="form"
    >
      <div className="flex gap-2 w-full justify-start [&>*]:w-full [&>*]:max-w-[200px]">
        {fields.map((field) => (
          <React.Fragment key={field.name}>
            {field.type === "text" && (
              <Input
                type="text"
                placeholder={field.placeholder ?? ""}
                value={formState[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                name={field.name}
                extraClass="w-full px-4 py-3"
              />
            )}
            {field.type === "select" && (
              <SelectField
                name={field.name}
                value={formState[field.name] ?? ""}
                options={field.options ?? []}
                onChange={handleChange}
                placeholder={field.placeholder ?? ""}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flexCenter [&>*]:h-full">
        <Button
          label={t("buttons.reset")}
          onClick={handleReset}
          variant="transparent"
          textColor="black"
        />
        <Button
          label={t("buttons.apply")}
          onClick={handleApply}
          variant="primary"
        />
      </div>
    </div>
  );
};

export default FilterForm;
