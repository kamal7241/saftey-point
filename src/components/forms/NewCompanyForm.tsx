"use client";
import Input from "@/components/formsUI/Input";
import { addCompanyValidationSchema, editCompanyValidationSchema } from "@/utils/validation/dashboardValidation";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import FileUploader from "../formsUI/FileUploader";
import SelectField from "../formsUI/SelectField";
import Button from "../ui/Button";
import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";
import SuccessMessage from "../ui/SuccessMessage";
import { submitCompany, updateCompany } from "@/api/companiesService";
import { SingleCompany } from "@/types/ui.types";
import { CompanyData } from "@/types/forms.types";

interface NewCompanyFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  companyData?: SingleCompany | null;
}

interface FormValues {
  companyName: string;
  status: string;
  email: string;
  phoneNumber: string;
  password: string;
  file: string | null;
}

export default function NewCompanyForm({
  title,
  sub_title,
  onClose,
  companyData,
}: NewCompanyFormProps) {
  const t = useTranslations("common");
  const tTable = useTranslations("tables");

  const initialValues: FormValues = companyData
    ? {
        companyName: companyData.user.firstName,
        status: companyData.status.toLowerCase(),
        email: companyData.user.email,
        phoneNumber: companyData.user.phone,
        password: "",
        file: companyData.user.avatar || null,
      }
    : {
        companyName: "",
        status: "",
        email: "",
        phoneNumber: "",
        password: "",
        file: null,
      };

  const handleGeneratePassword = (
    setFieldValue: (field: string, value: string) => void
  ) => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setFieldValue("password", randomPassword);
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiErrors, setApiErrors] = useState<string | null>(null);

  const handleSubmit = async (values: FormValues) => {
    const apiData: CompanyData = {
        name: values.companyName,
        status: values.status.toUpperCase(),
        userType: "COMPANY",
        user: {
            firstName: values.companyName,
            lastName: "COMPANY",
            avatar: values.file ?? "avatar.png",
            email: values.email,
            phone: values.phoneNumber,
            password: values.password,
            isVerified: true,
        },
    };

    try {
        let result;
        if (companyData && companyData.id) {
            // Map `SingleCompany` to `CompanyData` for `currentData`
            const currentData: CompanyData = {
                id: companyData.id, // `id` is now a `number`
                name: companyData.user.firstName, // Use `firstName` as `name` if `name` is not available
                status: companyData.status,
                userType: companyData.userType,
                user: {
                    firstName: companyData.user.firstName,
                    lastName: companyData.user.lastName,
                    avatar: companyData.user.avatar,
                    email: companyData.user.email,
                    phone: companyData.user.phone,
                    password: companyData.user.password || "", // Provide a default value
                    isVerified: companyData.user.isVerified,
                },
            };

            result = await updateCompany(companyData.id, apiData, currentData);
        } else {
            result = await submitCompany(apiData);
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
          title={"Successfully " + (companyData ? "Updated" : "Added")}
          msg={"Thank you for filling out your information!"}
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
        validationSchema={
          companyData && companyData.id
            ? editCompanyValidationSchema
            : addCompanyValidationSchema
        }
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
                label={t("logo_company")}
                note={t("fileuploader_note")}
                initialImageUrl={
                  companyData
                    ? `${process.env.NEXT_PUBLIC_URL}/${companyData.user.avatar}`
                    : null
                }
              />
            </div>

            {/* Company Name */}
            <div className="col-span-2">
              <Input
                label="Company Name"
                type="text"
                placeholder="Enter company name"
                value={values.companyName}
                onChange={handleChange}
                name="companyName"
              />
              <ErrorMessage
                name="companyName"
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
                  { value: "active", label: t("company_status.active") },
                  { value: "inactive", label: t("company_status.inactive") },
                  { value: "pending", label: t("company_status.pending") },
                  { value: "suspended", label: t("company_status.suspended") },
                  { value: "expired", label: t("company_status.expired") },
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

            {!companyData && (
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