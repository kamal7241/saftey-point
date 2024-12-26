"use client";
import Input from "@/components/formsUI/Input";
import { addCompanyValidationSchema } from "@/utils/validation/dashboardValidation";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import FileUploader from "../formsUI/FileUploader";
import SelectField from "../formsUI/SelectField";
import Button from "../ui/Button";
import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";
import SuccessMessage from "../ui/SuccessMessage";

interface NewCompanyFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
}
interface FormValues {
  companyName: string;
  status: string;
  email: string;
  phoneNumber: string;
  password: string;
  file: File | null;
}

export default function NewCompanyForm({
  title,
  sub_title,
  onClose,
}: NewCompanyFormProps) {
  const t = useTranslations("common");
  const tTable = useTranslations("tables");
  // const [passwordError, setPasswordError] = useState<string | null>(null);
  // const [isSuccess, setIsSuccess] = useState(false);

  const handleGeneratePassword = (
    setFieldValue: (field: string, value: string) => void
  ) => {
    const randomPassword = Math.random().toString(36).slice(-8); // Generate random password
    setFieldValue("password", randomPassword); // Set the generated password in the form
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (values: FormValues) => {
    console.log("Form Submitted:", values);
    setIsSubmitted(true); // Set submission status to true
  };

  if (!isSubmitted) {
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
          companyName: "",
          status: "",
          email: "",
          phoneNumber: "",
          password: "",
          file: null,
        }}
        validationSchema={addCompanyValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue, submitForm }) => (
          <Form className="w-full gap-4 grid grid-cols-4 mt-4">
            <div className="col-span-4">
              <FileUploader
                onChange={(file) => setFieldValue("file", file)}
                label={t("logo_company")}
                note={t("fileuploader_note")}
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
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
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
