"use client";
import Input from "@/components/formsUI/Input";
import Toggler from "@/components/formsUI/Toggler";
import { CourseTypeDTO } from "@/types/api.types";
import { CourseType } from "@/types/ui.types";
import { Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import * as Yup from "yup";
import { createCourseType, updateCourseType } from "@/api/courseTypesService";
import { showToast } from "@/utils/toast";
import SuccessMessage from "../ui/SuccessMessage";
import { useState } from "react";
import React from "react";

interface NewCourseTypeFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  courseTypeData?: CourseType | null;
}

interface FormValues {
  code: string;
  nameEnglish: string;
  nameArabic: string;
  isActive: boolean;
}

export default function NewCourseTypeForm({
  title,
  sub_title,
  onClose,
  courseTypeData,
}: NewCourseTypeFormProps) {
  const t = useTranslations("common");
  const tValidation = useTranslations("validation");
  const tMsgs = useTranslations("messages");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    code: Yup.string()
      .required(tValidation("required"))
      .max(50, tValidation("max_length", { max: 50 })),
    nameEnglish: Yup.string()
      .required(tValidation("required"))
      .max(255, tValidation("max_length", { max: 255 })),
    nameArabic: Yup.string()
      .required(tValidation("required"))
      .max(255, tValidation("max_length", { max: 255 })),
  });

  const initialValues: FormValues = courseTypeData
    ? {
        code: courseTypeData.code || "",
        nameEnglish: courseTypeData.nameEnglish || "",
        nameArabic: courseTypeData.nameArabic || "",
        isActive: courseTypeData.isActive,
      }
    : {
        code: "",
        nameEnglish: "",
        nameArabic: "",
        isActive: true,
      };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const dto: CourseTypeDTO = {
        code: values.code,
        nameEnglish: values.nameEnglish,
        nameArabic: values.nameArabic,
        isActive: values.isActive,
      };

      let result;
      if (courseTypeData && courseTypeData.id) {
        result = await updateCourseType(courseTypeData.id, dto);
      } else {
        result = await createCourseType(dto);
      }

      if (result.success) {
        setIsSubmitted(true);
        showToast.success(
          courseTypeData && courseTypeData.id
            ? tMsgs("course_type_updated_successfully")
            : tMsgs("course_type_created_successfully")
        );
      } else {
        showToast.error(
          result.error ||
          (courseTypeData && courseTypeData.id
            ? tMsgs("error_updating_course_type")
            : tMsgs("error_creating_course_type"))
        );
      }
    } catch (error) {
      console.error("Error submitting course type:", error);
      showToast.error(
        courseTypeData && courseTypeData.id
          ? tMsgs("error_updating_course_type")
          : tMsgs("error_creating_course_type")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-10">
        <SuccessMessage
          title={"Successfully " + (courseTypeData ? "Updated" : "Added")}
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
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, errors, setFieldValue }) => (
          <Form className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label={t("code")}
                  type="text"
                  placeholder={t("enter_code")}
                  value={values.code}
                  onChange={handleChange}
                  name="code"
                />
                {errors.code && (
                  <p className="text-xs text-red-500 py-1">{errors.code}</p>
                )}
              </div>

              <div>
                <Input
                  label={t("name_english")}
                  type="text"
                  placeholder={t("enter_name_english")}
                  value={values.nameEnglish}
                  onChange={handleChange}
                  name="nameEnglish"
                />
                {errors.nameEnglish && (
                  <p className="text-xs text-red-500 py-1">{errors.nameEnglish}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label={t("name_arabic")}
                  type="text"
                  placeholder={t("enter_name_arabic")}
                  value={values.nameArabic}
                  onChange={handleChange}
                  name="nameArabic"
                />
                {errors.nameArabic && (
                  <p className="text-xs text-red-500 py-1">{errors.nameArabic}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {t("is_active")}
                </label>
                <Toggler
                  checked={values.isActive}
                  onChange={(checked: boolean) => setFieldValue("isActive", checked)}
                />
              </div>
            </div>



            <div className="flex justify-end gap-4 border-t pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isSubmitting}
              >
                {t("buttons.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primaryLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("buttons.saving") : (courseTypeData ? t("buttons.save_changes") : t("buttons.save"))}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
} 