import Image from "next/image";
import React from "react";
import Input from "../formsUI/Input";

import Button from "../ui/Button";
import { useTranslations } from "next-intl";

type Permission = {
  name: string;
  isActive: boolean;
};

type Section = {
  title: string;
  permissions: Permission[];
};

// Add these props to the interface
type PermissionFormProps = {
  sections: Section[];
  title?: string;
  title2?: string;
  sub_title?: string;
  isEditable?: boolean;
  formData: {
    // key: string; // Key might not be needed directly in the form if managed by parent
    name: string;
    description: string;
  };
  onFormChange: (data: { name: string; description: string }) => void;
  onSectionsChange: (sections: Section[]) => void;
  onSubmit: () => void;
  errors?: {
    name?: string;
    description?: string;
    permissions?: string;
  };
  onCancel?: () => void;
};

const PermissionForm: React.FC<PermissionFormProps> = ({
  sections,
  title,
  title2,
  sub_title,
  // inView,
  isEditable, // Use isEditable
  formData,
  onFormChange,
  onSectionsChange,
  errors,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslations("common");

  const handleChange = (name: string, value: string) => {
    onFormChange({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {title && <h3 className="heading3">{title}</h3>}
      {sub_title && (
        <p className="textRegular mt-1.5">
          {sub_title.split("(*)").map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < sub_title.split("(*)").length - 1 && (
                <span className="text-red-400">(*)</span>
              )}
            </React.Fragment>
          ))}
        </p>
      )}
      {/* Show inputs only when isEditable is true */}
      {isEditable && (
        <div className="flex gap-2 w-full justify-start [&>*]:w-full [&>*]:max-w-[200px]">
          <Input
            type="text"
            placeholder={t("name")}
            value={formData.name}
            onChange={(value) => {
              if (typeof value === "string") {
                handleChange("name", value);
              } else if ("target" in value) {
                handleChange("name", value.target.value);
              }
            }}
            name={"name"}
            label={t("name")}
            extraClass="w-full px-4 py-3 h-[48px]"
            error={errors?.name}
          />

          <Input
            type="text"
            placeholder={t("description")}
            value={formData.description}
            onChange={(value) => {
              if (typeof value === "string") {
                handleChange("description", value);
              } else if ("target" in value) {
                handleChange("description", value.target.value);
              }
            }}
            name={"description"}
            label={t("description")}
            extraClass="w-full px-4 py-3 h-[48px]"
            error={errors?.description}
          />
        </div>
      )}
      {errors?.permissions && (
        <p className="text-red-500 text-sm mt-2">{errors.permissions}</p>
      )}
      {title2 && <h3 className="heading3">{title2}</h3>} {/* Changed from title to title2 */}
      <div className="flex-col justify-start items-start gap-6 inline-flex">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            // className="self-stretch h-16 flex-col justify-start items-start gap-4 flex" // Adjusted height to auto
            className="self-stretch flex-col justify-start items-start gap-4 flex"
          >
            <div className="self-stretch h-6 text-[#3d4245] text-xl font-medium font-['Cairo'] leading-normal">
              {section.title}
            </div>
            <div className="self-stretch justify-start items-center gap-[100px] inline-flex">
              {section.permissions.map((permission, permissionIndex) => (
                <React.Fragment key={permissionIndex}>
                  <label
                    key={permissionIndex}
                    htmlFor={`permission-${permissionIndex}-${sectionIndex}`}
                    // Remove pointer-events-none based on inView, control via isEditable if needed elsewhere
                    className={`flex items-center gap-2 cursor-pointer ${
                      !isEditable ? "pointer-events-none opacity-70" : "" // Disable interaction if not editable
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`permission-${permissionIndex}-${sectionIndex}`}
                      className="peer hidden"
                      checked={permission.isActive}
                      onChange={(e) => {
                        if (!isEditable) return; // Prevent change if not editable
                        const updatedSections = [...sections];
                        updatedSections[sectionIndex].permissions[
                          permissionIndex
                        ].isActive = e.target.checked;
                        onSectionsChange(updatedSections);
                      }}
                      disabled={!isEditable} // Also disable input itself
                    />
                    {/* Use different icons or styles based on isEditable if needed */}
                    <Image
                      src="/images/icons/checkbox.svg"
                      className="peer-checked:hidden"
                      width="24"
                      height="24"
                      alt=""
                    />
                    <Image
                      src="/images/icons/checkbox_checked.svg"
                      className="hidden peer-checked:block"
                      width="24"
                      height="24"
                      alt=""
                    />
                    <span className="select-none text-base font-normal text-black-100 whitespace-nowrap">
                      {permission.name}
                    </span>
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Show buttons only when isEditable is true */}
      {isEditable && (
        <div className="flex justify-end gap-4 col-span-4">
          <Button
            label={t("buttons.close")}
            // href={"/dashboard/admin-management"} // Or maybe call an onCancel prop
            onClick={() => { onCancel() }}
            variant="transparent"
            padding="py-3 px-4"
          />
          <Button
            label={t("buttons.submit")}
            onClick={onSubmit}
            type="submit"
            variant="primary"
            padding="py-3 px-4"
          />
        </div>
      )}
    </div>
  );
};

export default PermissionForm;
