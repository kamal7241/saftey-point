"use client";
import Input from "@/components/formsUI/Input";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import FileUploader from "../formsUI/FileUploader";
import SelectField from "../formsUI/SelectField";
import Button from "../ui/Button";
import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";
import SuccessMessage from "../ui/SuccessMessage";
import { submitAdmin, updateAdmin } from "@/api/adminService";
import { AdminData } from "@/types/forms.types";
import * as Yup from 'yup';
import { generateStrongPassword } from "@/utils/passwordGenerator";

interface NewAdminFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  adminData?: AdminData | null;
}

interface FormValues {
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  file: string | null;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  status: Yup.string().required('Status is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),
});

export default function NewAdminForm({
  title,
  sub_title,
  onClose,
  adminData,
}: NewAdminFormProps) {
  const t = useTranslations("common");
  const tTable = useTranslations("tables");

  const initialValues: FormValues = adminData
    ? {
        firstName: adminData.user.firstName,
        lastName: adminData.user.lastName,
        status: adminData.status.toLowerCase(),
        email: adminData.user.email,
        phoneNumber: adminData.user.phone,
        address: adminData.user.address,
        password: "",
        file: adminData.user.avatar || null,
      }
    : {
        firstName: "",
        lastName: "",
        status: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "",
        file: null,
      };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiErrors, setApiErrors] = useState<string | null>(null);

  const handleGeneratePassword = (
    setFieldValue: (field: string, value: string) => void
  ) => {
    const password = generateStrongPassword();
    setFieldValue("password", password);
  };
  
  const handleSubmit = async (values: FormValues) => {
    const apiData: AdminData = {
      status: values.status.toUpperCase(),
      userType: "ADMIN",
      user: {
        firstName: values.firstName,
        lastName: values.lastName,
        avatar: values.file ?? "avatar.png",
        email: values.email,
        phone: values.phoneNumber,
        address: values.address,
        password: values.password,
        isVerified: false,
      },
    };

    try {
      let result;
      if (adminData && adminData.id) {
        result = await updateAdmin(adminData.id, apiData, adminData);
      } else {
        result = await submitAdmin(apiData);
      }

      if (result.success) {
        setIsSubmitted(true);
        setApiErrors(null);
      } else {
        setApiErrors(result.error || "An error occurred");
      }
    } catch {
      setApiErrors("An unexpected error occurred");
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-10">
        <SuccessMessage
          title={"Successfully " + (adminData ? "Updated" : "Added")}
          msg={"Admin has been successfully " + (adminData ? "updated" : "created")}
          bigger
        />
      </div>
    );
  }

  return (
    <div>
      {title && <h3 className="heading3">{title}</h3>}
      {sub_title && (
        <p className="textRegular mt-1.5">{sub_title}</p>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className="w-full gap-4 grid grid-cols-4 mt-4">
            {apiErrors && (
              <div className="col-span-4">
                <div className="text-red-500">{apiErrors}</div>
              </div>
            )}
            <div className="col-span-4">
              <FileUploader
                onChange={(file) => setFieldValue("file", file)}
                label={t("user_photo")}
                note={t("fileuploader_note")}
                initialImageUrl={
                  adminData
                    ? `${process.env.NEXT_PUBLIC_URL}/${adminData.user.avatar}`
                    : null
                }
              />
            </div>

            {/* First Name */}
            <div className="col-span-2">
              <Input
                label="First Name"
                type="text"
                placeholder="Enter first name"
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

            {/* Last Name */}
            <div className="col-span-2">
              <Input
                label="Last Name"
                type="text"
                placeholder="Enter last name"
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

            {/* Address */}
            <div className="col-span-2">
              <Input
                label="Address"
                type="text"
                placeholder="Enter address"
                value={values.address}
                onChange={handleChange}
                name="address"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            {!adminData && (
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

            <div className="flex justify-end gap-4 col-span-4">
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