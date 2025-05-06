/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import * as Yup from "yup";
import Input from "../formsUI/Input";
import Button from "../ui/Button";
import SuccessMessage from "../ui/SuccessMessage";
import FileUploader from "../formsUI/FileUploader";
import { Partner } from "@/types/ui.types";
import { createPartner, updatePartner } from "@/api/partnerService";


interface NewPartnerFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  partnerData?: Partner | null;
}

interface FormValues {
  name: string;
  logo: string | null;
  website: string;
}

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  logo: Yup.mixed().required("Must be a valid URL").nullable(),
  website: Yup.string().url("Must be a valid URL").required("Required"),
});

export default function NewPartnerForm({
  title: propTitle,
  sub_title,
  onClose,
  partnerData,
}: NewPartnerFormProps) {
  const t = useTranslations("common");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiErrors, setApiErrors] = useState<string | null>(null);

  const formTitle = propTitle || (partnerData ? "Edit Partner" : "Add New Partner");

  const initialValues: FormValues = partnerData
    ? {
        name: partnerData.name || "",
        logo: partnerData.logo || null,
        website: partnerData.website || "",
      }
    : {
        name: "",
        logo: null,
        website: "",
      };

  const handleSubmit = async (values: FormValues) => {
    const apiData = {
      name: values.name,
      logo: values.logo ?? "",
      website: values.website,
    };
    setApiErrors(null);
    try {
      let result;
      if (partnerData && partnerData.id) {
        result = await updatePartner(partnerData.id, apiData);
      } else {
        result = await createPartner(apiData);
      }
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setApiErrors(
          result.message ||
            `An error occurred while ${partnerData ? "updating" : "creating"} the partner.`
        );
      }
    } catch (error: any) {
      setApiErrors(error.message || "An unexpected error occurred.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-10">
        <SuccessMessage
          title={partnerData ? "Successfully Updated" : "Successfully Added"}
          msg={`Partner has been ${partnerData ? "updated" : "created"} successfully!`}
          bigger
        />
        <div className="flex justify-center mt-4">
          <Button label={t("buttons.close")} onClick={onClose} variant="primary" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {formTitle && <h3 className="heading3">{formTitle}</h3>}
      {sub_title && <p className="textRegular mt-1.5">{sub_title}</p>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className="w-full gap-4 grid grid-cols-2 mt-4">
            {apiErrors && (
              <div className="col-span-2 p-2 bg-red-100 text-red-700 rounded border border-red-300">
                {apiErrors}
              </div>
            )}
            <div className="col-span-2">
              <Input
                label="Partner Name"
                type="text"
                placeholder="Enter partner name"
                value={values.name}
                onChange={handleChange}
                name="name"
              />
              <ErrorMessage name="name" component="div" className="text-xs text-red-500" />
            </div>
            <div className="col-span-2">
              <Input
                label="Website"
                type="text"
                placeholder="Enter partner website"
                value={values.website}
                onChange={handleChange}
                name="website"
              />
              <ErrorMessage name="website" component="div" className="text-xs text-red-500" />
            </div>
            <div className="col-span-2">
              <FileUploader
                onChange={(file) => setFieldValue("logo", file)}
                label={t("logo")}
                note={t("fileuploader_note")}
                initialImageUrl={partnerData ? `${process.env.NEXT_PUBLIC_URL}/${partnerData.logo}` : null}
              />
              <ErrorMessage name="logo" component="div" className="text-xs text-red-500" />
            </div>
            <div className="flex justify-end gap-4 col-span-2 mt-4">
              <Button
                label={t("buttons.close")}
                onClick={onClose}
                variant="transparent"
                padding="py-3 px-4"
                type="button"
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