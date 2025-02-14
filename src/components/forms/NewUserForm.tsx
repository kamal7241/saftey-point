"use client";
import Input from "@/components/formsUI/Input";
import { addUserValidationSchema } from "@/utils/validation/dashboardValidation";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import FileUploader from "../formsUI/FileUploader";
import SelectField from "../formsUI/SelectField";
import Button from "../ui/Button";
import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";
import SuccessMessage from "../ui/SuccessMessage";
import RadioField from "../formsUI/RadioField";

interface NewUserFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
}
interface FormValues {
  userName: string;
  status: string;
  email: string;
  phoneNumber: string;
  password: string;
  nationalId: string;
  nationalIdExpiry: string;
  identityType: string;
  nationality: string;
  birthday: string;
  file: File | null;
  nationalIdFront: File | null;
  nationalIdBack: File | null;
}

export default function NewUserForm({
  title,
  sub_title,
  onClose,
}: NewUserFormProps) {
  const t = useTranslations("common");
  const tTable = useTranslations("tables");

  const handleGeneratePassword = (
    setFieldValue: (field: string, value: string) => void
  ) => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setFieldValue("password", randomPassword);
  };
  const [apiErrors, setApiErrors] = useState<string | null>(null); // New state for API errors

  const [isSubmitted, setIsSubmitted] = useState(false);

  // const handleSubmit = (values: FormValues) => {
  //   console.log("Form Submitted:", values);
  //   setIsSubmitted(true);
  // };
  const handleSubmit = async (values: FormValues) => {
    console.log("Form Submitted:", values);

    const apiData = {
      identityType: values.identityType.toUpperCase(),
      nationalId: values.nationalId,
      nationalIdExpiry: values.nationalIdExpiry,
      nationalIdFront: values.nationalIdFront,
      nationalIdBack: values.nationalIdBack,
      nationality: values.nationality,
      birthday: values.birthday,
      user: {
        firstName: values.userName,
        lastName: "",
        avatar: "avatar.png",
        email: values.email,
        phone: values.phoneNumber,
        address: "123 Main St",
        password: values.password,
        isVerified: false,
      },
    };

    try {
      const response = await fetch(
        "https://api.imtyaaz.com/safety-point-academy/api/v1/individual",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );
      const result = await response.json();
      console.log("API Response:", result);
      if (result.success) {
        setIsSubmitted(true);
        setApiErrors(null);
      } else {
        setApiErrors(result.message);
      }
    } catch (error) {
      console.error("Error calling API:", error);
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
        initialValues={{
          userName: "",
          jobTitle: "",
          type: "",
          status: "",
          email: "",
          phoneNumber: "",
          nationalId: "",
          identityType: "national_id",
          password: "",
          file: null,
          nationalIdExpiry: "2025-01-01",
          nationality: "",
          birthday: "",
          nationalIdFront: null,
          nationalIdBack: null,
        }}
        validationSchema={addUserValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue, submitForm }) => (
          <Form className="w-full gap-4 grid grid-cols-4 mt-4">
            {apiErrors && <div className="text-red-500">{apiErrors}</div>}
            <div className="col-span-4">
              <FileUploader
                onChange={(file) => setFieldValue("file", file)}
                label={t("logo_user")}
                note={t("fileuploader_note")}
              />
            </div>
            <div className="col-span-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Full Name"
                value={values.userName}
                onChange={handleChange}
                name="userName"
              />
              <ErrorMessage
                name="userName"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* type */}
            <div className="col-span-2">
              <SelectField
                label={tTable("user_type")}
                name="type"
                value={values.type}
                onChange={(name, value) => setFieldValue(name, value)}
                options={[
                  { value: "individuals", label: t("user_type.individuals") },
                  { value: "company", label: t("user_type.company") },
                ]}
                customDropdown
              />
              <ErrorMessage
                name="type"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* Status */}
            <div className="col-span-2">
              <SelectField
                label={tTable("status")}
                name="status"
                value={values.status}
                onChange={(name, value) => setFieldValue(name, value)}
                options={[
                  { value: "active", label: t("user_status.active") },
                  { value: "inactive", label: t("user_status.inactive") },
                  { value: "pending", label: t("user_status.pending") },
                  { value: "suspended", label: t("user_status.suspended") },
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
            {/* Company Name */}
            {values.type === "company" && (
              <div className="col-span-4">
                <SelectField
                  label={tTable("company_name")}
                  name="type"
                  value={values.type}
                  onChange={(name, value) => setFieldValue(name, value)}
                  options={[
                    { value: "comapny_1", label: t("user_type.comapny_1") },
                    { value: "comapny_2", label: t("user_type.comapny_2") },
                  ]}
                  customDropdown
                />
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>
            )}
            {/* Identity Type */}
            {values.type && (
              <div className="col-span-4">
                <RadioField
                  label="Identity Type"
                  name="identityType"
                  options={[
                    { value: "national_id", label: "National ID" },
                    { value: "passport", label: "Passport" },
                  ]}
                  selectedValue={values.identityType}
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="identityType"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>
            )}
            {/* National ID */}
            <div className="col-span-4">
              <Input
                label="National ID"
                type="text"
                placeholder="Enter National ID"
                value={values.nationalId}
                onChange={handleChange}
                name="nationalId"
              />
              <ErrorMessage
                name="nationalId"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* National ID Front */}
            <div className="col-span-2">
              <FileUploader
                onChange={(file) => setFieldValue("nationalIdFront", file)}
                label="National ID Front"
                note="Upload the National ID Front image."
                subdirName="user"
                small
              />
              <ErrorMessage
                name="nationalIdFront"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* National ID Back */}
            <div className="col-span-2">
              <FileUploader
                onChange={(file) => setFieldValue("nationalIdBack", file)}
                label="National ID Back"
                note="Upload the National ID Back image."
                subdirName="user"
                small
              />
              <ErrorMessage
                name="nationalIdBack"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* Nationality */}
            <div className="col-span-4">
              <Input
                label="Nationality"
                type="text"
                placeholder="Enter Nationality"
                value={values.nationality}
                onChange={handleChange}
                name="nationality"
              />
              <ErrorMessage
                name="nationality"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* Birthday */}
            <div className="col-span-4">
              <Input
                label="Birthday"
                type="date"
                placeholder="Enter Birthday"
                value={values.birthday}
                onChange={handleChange}
                name="birthday"
              />
              <ErrorMessage
                name="birthday"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            <div className="col-span-4">
              <Input
                label="Job Title"
                type="text"
                placeholder="Job Title"
                value={values.jobTitle}
                onChange={handleChange}
                name="jobTitle"
              />
              <ErrorMessage
                name="jobTitle"
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
            <div className="col-span-3">
              <Input
                label="Password"
                type="password"
                placeholder="Enter password or generate one"
                value={values.password}
                onChange={handleChange}
                name="password"
                extraClass="p-3"
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
            <div className="flex justify-end gap-4 col-span-4">
              <Button
                label={t("buttons.close")}
                onClick={onClose}
                variant="transparent"
                padding="py-3 px-4"
              />
              <Button
                label={t("buttons.submit")}
                onClick={submitForm}
                type="submit"
                variant="primary"
                padding="py-3 px-4"
                // disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
