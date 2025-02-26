import Image from "next/image";
import React from "react";
import Input from "../formsUI/Input";
import SelectField from "../formsUI/SelectField";
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

type PermissionFormProps = {
  sections: Section[];
  title?: string;
  title2?: string;
  sub_title?: string;
  inView?: boolean;
};

const PermissionForm: React.FC<PermissionFormProps> = ({
  sections,
  title,
  title2,
  sub_title,
  inView,
}) => {
  const t = useTranslations("common");
  const handleChange = (name: string, value: string) => {
    console.log("handleChange", name, value);
  };

  const submitForm = () => {
    console.log("Form Submitted:");
    // setIsSubmitted(true);
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
      {!inView && (
        <div className="flex gap-2 w-full justify-start [&>*]:w-full [&>*]:max-w-[200px]">
          <Input
            type="text"
            placeholder={"name"}
            value={""}
            onChange={(e) => {
              if (typeof e === "string") {
                handleChange("name", e);
              } else if ("target" in e) {
                handleChange("name", e.target.value);
              }
            }}
            name={"name"}
            label={"name"}
            extraClass="w-full px-4 py-3 h-[48px]"
          />
          <SelectField
            name={"status"}
            value={""}
            options={[
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ]}
            onChange={handleChange}
            placeholder={"status"}
            label={"status"}
          />
        </div>
      )}
      {title && <h3 className="heading3">{title2}</h3>}
      <div className="flex-col justify-start items-start gap-6 inline-flex">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="self-stretch h-16 flex-col justify-start items-start gap-4 flex"
          >
            <div className="self-stretch h-6 text-[#3d4245] text-xl font-medium font-['Cairo'] leading-normal">
              {section.title}
            </div>
            <div className="self-stretch justify-start items-center gap-[100px] inline-flex">
              {section.permissions.map((permission, permissionIndex) => (
                <>
                  <label
                    key={permissionIndex}
                    htmlFor={`permission-${permissionIndex}-${sectionIndex}`}
                    className={`flex items-center gap-2 cursor-pointer ${
                      inView ? "pointer-events-none" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`permission-${permissionIndex}-${sectionIndex}`}
                      className="peer hidden"
                      defaultChecked={permission.isActive}
                    />
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
                </>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!inView && (
        <div className="flex justify-end gap-4 col-span-4">
          <Button
            label={t("buttons.close")}
            href={"/dashboard/admin-management"}
            variant="transparent"
            padding="py-3 px-4"
          />
          <Button
            label={t("buttons.submit")}
            onClick={submitForm}
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
