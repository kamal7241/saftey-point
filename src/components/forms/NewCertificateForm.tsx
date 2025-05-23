/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Input from "@/components/formsUI/Input";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import SuccessMessage from "../ui/SuccessMessage";
import {
  createCertificate,
  updateCertificate,
} from "@/api/certificatesService";
import SelectField from "../formsUI/SelectField";
import { fetchCourses } from "@/api/courseService";
import Spinner from "../ui/icons/Spinner";
import RadioField from "../formsUI/RadioField";
import { certificateValidationSchemaGeneral } from "@/utils/validation/dashboardValidation";

interface NewCertificateFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  certificateData?: any | null;
}

interface FormValues {
  title: string;
  validFrom: string;
  validTo: string;
  issueDate: string;
  displayScore: string;
  watermark: string;
  courseId: number;
}

export default function NewCertificateForm({
  title,
  sub_title,
  onClose,
  certificateData,
}: NewCertificateFormProps) {
  const t = useTranslations("common");
  const tValidation = useTranslations("validation");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialValues: any = certificateData
    ? {
        title: certificateData.title,
        validFrom: certificateData.validFrom,
        validTo: certificateData.validTo,
        issueDate: certificateData.issueDate,
        displayScore: certificateData.displayScore,
        watermark: certificateData.watermark,
        courseId: certificateData.id,
      }
    : {
        title: "",
        validFrom: "",
        validTo: "",
        issueDate: "",
        displayScore: "no",
        watermark: "no",
        courseId: 0,
      };

  const [apiErrors, setApiErrors] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
      const offset = 0;
      const response = await fetchCourses(offset, 100);
      setCourses(response.courses);
      setLoading(false);
    };
    getCourses();
  }, []);

  const handleSubmit = async (values: FormValues) => {
    try {
      const result = certificateData
        ? await updateCertificate(certificateData.id, {
            ...values,
            courseId: Number(values.courseId),
            validFrom: values.validFrom ? values.validFrom.split("T")[0] : "",
            validTo: values.validTo ? values.validTo.split("T")[0] : "",
            issueDate: values.issueDate ? values.issueDate.split("T")[0] : "",
          })
        : await createCertificate({
            ...values,
            courseId: Number(values.courseId),
            validFrom: values.validFrom ? values.validFrom.split("T")[0] : "",
            validTo: values.validTo ? values.validTo.split("T")[0] : "",
            issueDate: values.issueDate ? values.issueDate.split("T")[0] : "",
          });
      if (result?.success) {
        setIsSubmitted(true);
        setApiErrors(null);
        if (onClose) {
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } else {
        setIsSubmitted(false);
        setApiErrors(result?.error || "An error occurred");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsSubmitted(false);
      setApiErrors("Failed to create certificate");
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-10">
        <SuccessMessage
          title={"Successfully Added"}
          msg={"Certificate has been created successfully!"}
          bigger
        />
      </div>
    );
  }

  return (
    <div>
      {title && <h3 className="heading3">{title}</h3>}
      {sub_title && <p className="textRegular mt-1.5">{sub_title}</p>}
      {loading ? <Spinner /> : null}
      <Formik<FormValues> initialValues={initialValues} onSubmit={handleSubmit} validationSchema={certificateValidationSchemaGeneral(tValidation)}>
        {({ values, handleChange, setFieldValue }) => (
          <Form className="mt-4 grid w-full grid-cols-4 gap-4">
            {apiErrors && (
              <div className="col-span-4">
                <div className="text-red-500">{apiErrors}</div>
              </div>
            )}

            <div className="col-span-4">
              <SelectField
                label={t("course")}
                name="courseId"
                value={values.courseId ? values.courseId.toString() : "0"}
                onChange={(name, value) => setFieldValue(name, value)}
                options={
                  courses.length > 0
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      courses.map((course: any) => ({
                        value: (course as { id: number }).id.toString(),
                        label: (course as { title: string }).title,
                      }))
                    : []
                }
                customDropdown
              />
              <ErrorMessage
                name="courseId"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            <div className="col-span-4">
              <Input
                label={t('title')}
                type="text"
                placeholder={t('title')}
                value={values.title}
                onChange={handleChange}
                name="title"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-2">
              <Input
                label={t("validFrom")}
                type="date"
                value={values.validFrom}
                onChange={(value) => {
                  if (typeof value === "string") {
                    setFieldValue("validFrom", value);
                  } else if (value instanceof Date) {
                    setFieldValue("validFrom", value.toISOString());
                  }
                }}
                name="validFrom"
              />
              <ErrorMessage
                name="validFrom"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-2">
              <Input
                label={t("validTo")}
                type="date"
                value={values.validTo}
                onChange={(value) => {
                  if (typeof value === "string") {
                    setFieldValue("validTo", value);
                  } else if (value instanceof Date) {
                    setFieldValue("validTo", value.toISOString());
                  }
                }}
                name="validTo"
              />
              <ErrorMessage
                name="validTo"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-4">
              <Input
                label={t("issueDate")}
                type="date"
                value={values.issueDate}
                onChange={(value) => {
                  if (typeof value === "string") {
                    setFieldValue("issueDate", value);
                  } else if (value instanceof Date) {
                    setFieldValue("issueDate", value.toISOString());
                  }
                }}
                name="issueDate"
              />
              <ErrorMessage
                name="issueDate"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="col-span-2">
              <RadioField
                label={t("displayScore")}
                name="displayScore"
                options={[
                  { value: "yes", label: t("yes") },
                  { value: "no", label: t("no") },
                ]}
                selectedValue={values.displayScore}
                onChange={handleChange}
              />
              <ErrorMessage
                name="displayScore"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
            <br />
            <div className="col-span-2">
              <RadioField
                label={t("watermark")}
                name="watermark"
                options={[
                  { value: "yes", label: t("yes") },
                  { value: "no", label: t("no") },
                ]}
                selectedValue={values.watermark}
                onChange={handleChange}
              />
              <ErrorMessage
                name="watermark"
                component="div"
                className="text-xs text-red-500"
              />
            </div>
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
