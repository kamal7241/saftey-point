"use client";
import Input from "@/components/formsUI/Input";
import {
  addUserValidationSchema,
  editUserValidationSchema,
} from "@/utils/validation/dashboardValidation";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import FileUploader from "../formsUI/FileUploader";
import SelectField from "../formsUI/SelectField";
import Button from "../ui/Button";
import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";
import SuccessMessage from "../ui/SuccessMessage";
import RadioField from "../formsUI/RadioField";
import { submitIndividual, updateIndividual } from "@/api/dashboardService";
import { Individual } from "@/types/ui.types";

interface NewUserFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  userData?: Individual | null;
}
interface FormValues {
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  type: string;
  phoneNumber: string;
  password: string;
  nationalId: string;
  nationalIdExpiry: string;
  identityType: string;
  jobTitle: string;
  nationality: string;
  birthday: string;
  avatar: string;
  nationalIdFront: string;
  nationalIdBack: string;
}

export default function NewUserForm({
  title,
  sub_title,
  onClose,
  userData,
}: NewUserFormProps) {
  const t = useTranslations("common");
  const tTable = useTranslations("tables");

  const initialValues: FormValues = userData
    ? {
        firstName: userData.user.firstName,
        lastName: userData.user.lastName || "",
        jobTitle: userData.user.jobTitle || "",
        type: userData.userType.toLowerCase(),
        status: userData.user.isVerified ? "active" : "inactive",
        email: userData.user.email,
        phoneNumber: userData.user.phone || "",
        nationalId: userData.nationalId,
        identityType: userData.identityType.toLowerCase() || "national_id",
        password: "",
        avatar: userData.user.avatar || "avatar.png",
        nationalIdExpiry: userData.nationalIdExpiry || "2025-01-01",
        nationality: userData.nationality || "",
        birthday: userData.birthday || "",
        nationalIdFront: userData.nationalIdFront || "",
        nationalIdBack: userData.nationalIdBack || "",
      }
    : {
        firstName: "",
        lastName: "",
        jobTitle: "",
        type: "",
        status: "",
        email: "",
        phoneNumber: "",
        nationalId: "",
        identityType: "national_id",
        password: "",
        avatar: "",
        nationalIdExpiry: "2025-01-01",
        nationality: "",
        birthday: "",
        nationalIdFront: "",
        nationalIdBack: "",
      };
  const handleGeneratePassword = (
    setFieldValue: (field: string, value: string) => void
  ) => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setFieldValue("password", randomPassword);
  };
  const [apiErrors, setApiErrors] = useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    console.log("Form Submitted:", values);

    const mappedValues: Individual = {
      identityType: values.identityType,
      nationalId: values.nationalId,
      nationalIdExpiry: values.nationalIdExpiry,
      nationalIdFront: values.nationalIdFront,
      nationalIdBack: values.nationalIdBack,
      nationality: values.nationality,
      birthday: values.birthday,
      status: values.status || "pending",
      userType: values.type,
      user: {
        id: userData ? userData.user.id : 0,
        firstName: values.firstName,
        lastName: values.lastName || "",
        avatar: values.avatar || "avatar.png",
        email: values.email,
        phone: values.phoneNumber,
        isVerified: false,
      },
    };

    let result;
    if (userData && userData.id) {
      result = await updateIndividual(userData.id, mappedValues);
    } else {
      result = await submitIndividual(mappedValues);
    }

    if (result.success === true) {
      setIsSubmitted(true);
      setApiErrors(null);
    } else {
      setApiErrors(result.error || null);
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

      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={
          userData && userData.id
            ? editUserValidationSchema
            : addUserValidationSchema
        }
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue, submitForm }) => (
          <Form className="mt-4 grid w-full grid-cols-4 gap-4">
            {apiErrors && <div className="col-span-4"><div className="text-red-500">{apiErrors}</div></div>}
            <div className="col-span-4">
              <FileUploader
                onChange={(file) => setFieldValue("avatar", file)}
                label={t("logo_user")}
                note={t("fileuploader_note")}
                subdirName="user"
                initialImageUrl={userData?`${process.env.NEXT_PUBLIC_URL}/${initialValues.avatar}`: null}
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
            {/* type */}
            <div className="col-span-2">
              <SelectField
                label={tTable("user_type")}
                name="type"
                value={values.type}
                onChange={(name, value) => setFieldValue(name, value)}
                options={[
                  { value: "individual", label: t("user_type.individual") },
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
                subdirName="user"
                small
                initialImageUrl={userData?`${process.env.NEXT_PUBLIC_URL}/${initialValues.nationalIdFront}`: null}
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
                subdirName="user"
                small
                initialImageUrl={userData?`${process.env.NEXT_PUBLIC_URL}/${initialValues.nationalIdBack}`: null}
              />
              <ErrorMessage
                name="nationalIdBack"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            {/* Nationality */}
            <div className="col-span-2">
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
            <div className="col-span-2">
              <Input
                label={tTable("expiry_date")}
                type="date"
                placeholder="Enter Expiry Date"
                value={values.nationalIdExpiry}
                onChange={handleChange}
                name="nationalIdExpiry"
              />
              <ErrorMessage
                name="nationalIdExpiry"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

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
                required={false}
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
                onClick={submitForm}
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
