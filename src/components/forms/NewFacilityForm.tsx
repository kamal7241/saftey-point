"use client";
import { createFacility, updateFacility } from "@/api/presetsService";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import * as Yup from "yup";
import Input from "../formsUI/Input";
import Button from "../ui/Button";
import SuccessMessage from "../ui/SuccessMessage";
import FileUploader from "../formsUI/FileUploader";

interface SingleFacility {
  id: number;
  title: string;
  titleArabic?: string;
  description: string;
  imageUrl: string;
}

interface NewFacilityFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  facilityData?: SingleFacility | null;
}

interface FormValues {
  title: string;
  titleArabic: string;
  description: string;
  imageUrl: string | null;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Required"),
  titleArabic: Yup.string(), // Optional
  description: Yup.string().required("Required"),
  imageUrl: Yup.mixed().required("Must be a valid URL").nullable(),
});

export default function NewFacilityForm({
  title: propTitle,
  sub_title,
  onClose,
  facilityData,
}: NewFacilityFormProps) {
  const t = useTranslations("common");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiErrors, setApiErrors] = useState<string | null>(null);

  const formTitle =
    propTitle || (facilityData ? "Edit Facility" : "Add New Facility");

  const initialValues = (facilityData as FormValues)
    ? {
      title: facilityData?.title || "",
      titleArabic: facilityData?.titleArabic || "",
      description: facilityData?.description || "",
      imageUrl: facilityData?.imageUrl || null,
    }
    : {
      title: "",
      titleArabic: "",
      description: "",
      imageUrl: null,
    };

  const handleSubmit = async (values: FormValues) => {
    const apiData: SingleFacility = {
      title: values.title,
      titleArabic: values.titleArabic,
      description: values.description,
      imageUrl: values.imageUrl ?? "",
      id: facilityData?.id || 0,
    };

    setApiErrors(null);

    try {
      let result;
      if (facilityData && facilityData.id) {
        const currentData: SingleFacility = {
          title: facilityData.title,
          titleArabic: facilityData.titleArabic,
          description: facilityData.description,
          imageUrl: facilityData.imageUrl,
          id: facilityData.id,
        };
        result = await updateFacility(facilityData.id, apiData, currentData);
      } else {
        result = await createFacility(apiData);
      }
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setApiErrors(
          result.message ||
          `An error occurred while ${facilityData ? "updating" : "creating"
          } the facility.`
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setApiErrors(error.message || "An unexpected error occurred.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-10">
        <SuccessMessage
          title={facilityData ? "Successfully Updated" : "Successfully Added"}
          msg={`Facility has been ${facilityData ? "updated" : "created"
            } successfully!`}
          bigger
        />
        <div className="flex justify-center mt-4">
          <Button
            label={t("buttons.close")}
            onClick={onClose}
            variant="primary"
          />
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

            <div className="col-span-1">
              <Input
                label="Facility Title (English)"
                type="text"
                placeholder="Enter facility title"
                value={values.title}
                onChange={handleChange}
                // onBlur={handleBlur}
                name="title"
              // error={touched.title && errors.title}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-1">
              <Input
                label="Facility Title (Arabic)"
                type="text"
                placeholder="أدخل عنوان المنشأة" // Placeholder in Arabic
                value={values.titleArabic}
                onChange={handleChange}
                // onBlur={handleBlur}
                name="titleArabic"
              // error={touched.titleArabic && errors.titleArabic}
              />
              <ErrorMessage
                name="titleArabic"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-2">
              <Input
                label="Description"
                type="textarea"
                placeholder="Enter facility description"
                value={values.description}
                onChange={handleChange}
                name="description"
              // error={touched.description && errors.description}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-2">
              <div className="col-span-4">
                <FileUploader
                  onChange={(file) => setFieldValue("imageUrl", file)}
                  label={t("logo")}
                  note={t("fileuploader_note")}
                  initialImageUrl={
                    facilityData
                      ? `${process.env.NEXT_PUBLIC_URL}/${facilityData && facilityData.imageUrl}`
                      : null
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 col-span-2 mt-4">
              <Button
                label={t("buttons.close")}
                onClick={onClose}
                variant="transparent"
                padding="py-3 px-4"
                type="button" // Ensure it doesn't submit the form
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
