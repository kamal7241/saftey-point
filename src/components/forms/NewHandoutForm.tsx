"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { HandoutDTO } from "@/types/api.types";
import { createHandout, updateHandout } from "@/api/handoutsService";
import { showToast } from "@/utils/toast";
import Button from "../ui/Button";
import Input from "../formsUI/Input";
import Textarea from "../formsUI/Textarea";
import Toggler from "../formsUI/Toggler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

interface NewHandoutFormProps {
  initialValues: Partial<HandoutDTO>;
  onSubmit: (values: HandoutDTO) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  fileUrl: Yup.string().required("File URL is required"),
  fileType: Yup.string().required("File type is required"),
  fileSize: Yup.number().required("File size is required").min(0, "File size must be positive"),
  isActive: Yup.boolean(),
});

export default function NewHandoutForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}: NewHandoutFormProps) {
  const t = useTranslations("common");

  const handleSubmit = async (values: HandoutDTO) => {
    try {
      let result;
      if (initialValues.id) {
        // Update existing handout
        result = await updateHandout(initialValues.id, values);
      } else {
        // Create new handout
        result = await createHandout(values);
      }

      if (result.success) {
        showToast.success(
          initialValues.id 
            ? t("handout_updated_successfully") 
            : t("handout_added_successfully")
        );
        onSubmit(values);
      } else {
        showToast.error(result.error || t("error_saving_handout"));
      }
    } catch (error) {
      console.error("Error saving handout:", error);
      showToast.error(t("error_saving_handout"));
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <FontAwesomeIcon icon={faFileAlt} className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          {initialValues.id ? t("edit_handout") : t("add_handout")}
        </h2>
      </div>

      <Formik
        initialValues={{
          title: initialValues.title || "",
          description: initialValues.description || "",
          fileUrl: initialValues.fileUrl || "",
          fileType: initialValues.fileType || "",
          fileSize: initialValues.fileSize || 0,
          isActive: initialValues.isActive ?? true,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("title")} *
                </label>
                <Input
                  name="title"
                  type="text"
                  placeholder={t("enter_title")}
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title && errors.title ? errors.title : undefined}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("file_type")} *
                </label>
                <Input
                  name="fileType"
                  type="text"
                  placeholder={t("enter_file_type")}
                  value={values.fileType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.fileType && errors.fileType}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("description")} *
              </label>
              <Textarea
                name="description"
                placeholder={t("enter_description")}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && errors.description}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("file_url")} *
                </label>
                <Input
                  name="fileUrl"
                  type="url"
                  placeholder={t("enter_file_url")}
                  value={values.fileUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.fileUrl && errors.fileUrl}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("file_size")} (bytes) *
                </label>
                <Input
                  name="fileSize"
                  type="number"
                  placeholder={t("enter_file_size")}
                  value={values.fileSize}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.fileSize && errors.fileSize}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("is_active")}
              </label>
              <Toggler
                name="isActive"
                checked={values.isActive}
                onChange={handleChange}
                label={values.isActive ? t("active") : t("inactive")}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="transparent"
                onClick={onCancel}
                disabled={isLoading}
                icon={<FontAwesomeIcon icon={faTimes} className="w-4 h-4" />}
                label={t("buttons.cancel")}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                icon={<FontAwesomeIcon icon={faSave} className="w-4 h-4" />}
                label={isLoading ? t("buttons.saving") : t("buttons.save")}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
} 