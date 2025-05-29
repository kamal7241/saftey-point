"use client";
import { submitStaff, updateStaff } from "@/api/staffService";
import Input from "@/components/formsUI/Input";
import { SingleStaff } from "@/types/ui.types";
import { addStaffValidationSchema, editStaffValidationSchema } from "@/utils/validation/dashboardValidation";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import FileUploader from "../formsUI/FileUploader";
import SelectField from "../formsUI/SelectField";
import StaffRoleSelectField from "./StaffRoleSelectField";
import Button from "../ui/Button";
import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";
import SuccessMessage from "../ui/SuccessMessage";
import { generateStrongPassword } from "@/utils/passwordGenerator";
import { UserStatus } from "@/enum/user-status.enum";

interface NewStaffFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  userData?: SingleStaff | null;
}

interface FormValues {
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  role: number | ""; // Changed to number or empty string to store role ID
  phoneNumber: string;
  password: string;
  resume: string | null;
  avatar: string | null;
}

export default function NewStaffForm({
  title,
  sub_title,
  onClose,
  userData,
}: NewStaffFormProps) {
  const t = useTranslations("common");
  const tTable = useTranslations("tables");

  const initialValues: FormValues = userData
    ? {
      firstName: userData.user.firstName,
      lastName: userData.user.lastName || "",
      status: userData.status || "pending",
      email: userData.user.email,
      phoneNumber: userData.user.phone || "",
      password: "",
      resume: null,
      role: userData ? "" : "",
      avatar: userData.user.avatar,
    }
    : {
      firstName: "",
      lastName: "",
      status: UserStatus.ACTIVE.toLowerCase(),
      email: "",
      phoneNumber: "",
      password: "",
      resume: null,
      role: "", 
      avatar: null,
    };


  const handleGeneratePassword = (
    setFieldValue: (field: string, value: string) => void
  ) => {
    const password = generateStrongPassword();
    setFieldValue("password", password);
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiErrors, setApiErrors] = useState<string | null>(null);
  const handleSubmit = async (values: FormValues) => {
    const mappedValues: SingleStaff = {
      resume: values.resume ?? "",
      status: values.status || "pending",
      userType: "staff".toUpperCase(),
      user: {
        id: userData ? userData.user.id : 0,
        firstName: values.firstName,
        lastName: values.lastName || "",
        avatar: values.avatar || "",
        email: values.email,
        phone: values.phoneNumber,
        password: values.password,
        isVerified: true,
        roleId: values.role? values.role.toString() : "",
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    if (userData && userData.id) {
      result = await updateStaff(userData.id, mappedValues, userData);
    } else {
      result = await submitStaff(mappedValues);
    }
    if (result && result.success === true) {
      setIsSubmitted(true);
      setApiErrors(null);
    } else {
      setIsSubmitted(false);
      setApiErrors(result?.message);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-10">
        <SuccessMessage
          title={"Successfully Added"}
          msg={"Thank you for filling out your information! ."}
          bigger
        />
      </div>
    );
  }

  return (
    <div>
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

      <Formik
        initialValues={initialValues}
        validationSchema={userData ? editStaffValidationSchema : addStaffValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className="mt-4 grid w-full grid-cols-4 gap-4">
            {apiErrors && (
              <div className="col-span-4">
                <div className="text-red-500">{apiErrors}</div>
              </div>
            )}
            <div className="col-span-4">
              <FileUploader
                onChange={(file) => setFieldValue("avatar", file)}
                label={t("logo_user")}
                note={t("fileuploader_note")}
                subdirName="staff"
                initialImageUrl={
                  userData
                    ? `${process.env.NEXT_PUBLIC_URL}/${initialValues.avatar}`
                    : null
                }
              />
              <ErrorMessage
                name="avatar"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-2">
              <Input
                label="First Name"
                type="text"
                placeholder="First Name"
                value={values.firstName}
                onChange={handleChange}
                name="firstName"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Last Name"
                type="text"
                placeholder="Last Name"
                value={values.lastName}
                onChange={handleChange}
                name="lastName"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-2">
              <StaffRoleSelectField
                label={tTable("role")}
                name="role"
                value={values.role}
                onChange={(name, value) => setFieldValue(name, value)}
                customDropdown
                placeholder={t('select_role_placeholder')}
              />
              <ErrorMessage
                name="role"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* Status */}
            <div className="col-span-2">
              <SelectField
                label={tTable("status")}
                name="status"
                value={values.status.toLowerCase()}
                onChange={(name, value) => setFieldValue(name, value)}
                options={[
                  { value: "active", label: t("user_status.active") },
                  { value: "inactive", label: t("user_status.inactive") },
                  { value: "pending", label: t("user_status.pending") },
                  { value: "expired", label: t("user_status.expired") },
                ]}
                customDropdown
              />
              <ErrorMessage
                name="status"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            <div className="col-span-4">
              <FileUploader
                onChange={(file) => setFieldValue("resume", file)}
                label="Attach Resume"
                subdirName="user"
                small
                initialImageUrl={
                  userData
                    ? `${process.env.NEXT_PUBLIC_URL}/${initialValues.resume}`
                    : null
                }
              />
              <ErrorMessage
                name="resume"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            {/* Email */}
            <div className="col-span-2">
              <Input
                label="Email"
                type="email"
                placeholder="Enter email address"
                value={values.email}
                onChange={handleChange}
                name="email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            {/* Phone Number */}
            <div className="col-span-2">
              <Input
                label="Phone Number"
                type="text"
                placeholder="Enter phone number"
                value={values.phoneNumber}
                onChange={handleChange}
                name="phoneNumber"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {!userData && (
              <>
                <div className="col-span-3">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password or generate one"
                    value={values.password}
                    onChange={handleChange}
                    name="password"
                  />
                </div>
                <div className="col-span-1 self-end">
                  <Button
                    label={t("buttons.generate")}
                    onClick={() => handleGeneratePassword(setFieldValue)}
                    type="button"
                    variant="dark"
                    padding="px-4 py-2.5"
                    textSize="text-base w-full"
                  />
                </div>
                <div className="col-span-4">
                  <ErrorMessage name="password">
                    {(msg) => <ErrorMessageWrappers msg={msg} />}
                  </ErrorMessage>
                </div>
              </>
            )}
            <div className="col-span-4 flex justify-end gap-4">
              <Button
                label={t("buttons.close")}
                onClick={onClose}
                variant="transparent"
                padding="py-3 px-4"
              />
              <Button
                label={t("buttons.submit")}
                type="submit"
                variant="primary"
                padding="py-3 px-4"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
