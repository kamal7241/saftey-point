"use client";
import { createCountry, updateCountry } from "@/api/countryService";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import * as Yup from "yup";
import Input from "../formsUI/Input";
import Button from "../ui/Button";
import SuccessMessage from "../ui/SuccessMessage";
import { Country } from "@/types/ui.types";

interface NewCountryFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  countryData?: Country | null;
}

interface FormValues {
  code: string;
  name: string;
  phoneCode: string;
  emoji: string;
}

const validationSchema = Yup.object({
  code: Yup.string().required("Required"),
  name: Yup.string().required("Required"),
  phoneCode: Yup.string().required("Required"),
  emoji: Yup.string().required("Required"),
});

export default function NewCountryForm({
  title: propTitle,
  sub_title,
  onClose,
  countryData,
}: NewCountryFormProps) {
  const t = useTranslations("common");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiErrors, setApiErrors] = useState<string | null>(null);

  const formTitle =
    propTitle || (countryData ? "Edit Country" : "Add New Country");

  const initialValues: FormValues = countryData
    ? {
        code: countryData.code || "",
        name: countryData.name || "",
        phoneCode: countryData.phoneCode || "",
        emoji: countryData.emoji || "",
      }
    : {
        code: "",
        name: "",
        phoneCode: "",
        emoji: "",
      };

  const handleSubmit = async (values: FormValues) => {
    const apiData = {
      code: values.code,
      name: values.name,
      phoneCode: values.phoneCode,
      emoji: values.emoji,
      isActive: true,
    };

    setApiErrors(null);

    try {
      let result;
      if (countryData && countryData.id) {
        result = await updateCountry(countryData.id, apiData);
      } else {
        result = await createCountry(apiData);
      }
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setApiErrors(
          result.message ||
            `An error occurred while ${countryData ? "updating" : "creating"} the country.`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setApiErrors(error.message);
      } else {
        setApiErrors("An unexpected error occurred.");
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-10">
        <SuccessMessage
          title={countryData ? "Successfully Updated" : "Successfully Added"}
          msg={`Country has been ${countryData ? "updated" : "created"} successfully!`}
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
        {({ values, handleChange }) => (
          <Form className="w-full gap-4 grid grid-cols-2 mt-4">
            {apiErrors && (
              <div className="col-span-2 p-2 bg-red-100 text-red-700 rounded border border-red-300">
                {apiErrors}
              </div>
            )}

            <div className="col-span-1">
              <Input
                label={t("country_code")}
                type="text"
                placeholder="Enter country code (e.g. US)"
                value={values.code}
                onChange={handleChange}
                name="code"
              />
              <ErrorMessage
                name="code"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-1">
              <Input
                label={t("country_name")}
                type="text"
                placeholder="Enter country name"
                value={values.name}
                onChange={handleChange}
                name="name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-1">
              <Input
                label={t("phone_code")}
                type="text"
                placeholder="Enter phone code (e.g. +1)"
                value={values.phoneCode}
                onChange={handleChange}
                name="phoneCode"
              />
              <ErrorMessage
                name="phoneCode"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-1">
              <Input
                label={t("emoji")}
                type="text"
                placeholder="Enter country emoji (e.g. 🇺🇸)"
                value={values.emoji}
                onChange={handleChange}
                name="emoji"
              />
              <ErrorMessage
                name="emoji"
                component="div"
                className="text-xs text-red-500"
              />
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