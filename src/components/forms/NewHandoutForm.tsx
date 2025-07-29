"use client";

import React, { useState } from "react";
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
import FileUploader from "../formsUI/FileUploader";
import SelectField from "../formsUI/SelectField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";

interface NewHandoutFormProps {
  initialValues: Partial<HandoutDTO>;
  onSubmit: (values: HandoutDTO) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  accessLevel: Yup.string().required("Access level is required"),
  isRequired: Yup.boolean(),
  sortOrder: Yup.number().min(0, "Sort order must be positive"),
  isActive: Yup.boolean(),
});

const accessLevelOptions = [
  { value: "FREE", label: "Free" },
  { value: "ENROLLED", label: "Enrolled Users" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PAID", label: "Paid" },
];

const fileTypeOptions = [
  { value: "PDF", label: "PDF" },
  { value: "DOC", label: "DOC" },
  { value: "DOCX", label: "DOCX" },
  { value: "PPT", label: "PPT" },
  { value: "PPTX", label: "PPTX" },
  { value: "XLS", label: "XLS" },
  { value: "XLSX", label: "XLSX" },
  { value: "TXT", label: "TXT" },
];

export default function NewHandoutForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}: NewHandoutFormProps) {
  const t = useTranslations("common");
  const [uploadedFile, setUploadedFile] = useState<{
    fileName: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
  } | null>(null);

  const handleFileUpload = (filePath: string | null, setFieldValue?: (field: string, value: string | number | boolean) => void) => {
    if (filePath) {
      // Extract file information from the uploaded file
      const fileName = filePath.split('/').pop() || '';
      const fileExtension = fileName.split('.').pop()?.toUpperCase() || '';
      
      setUploadedFile({
        fileName,
        fileSize: 0, // Will be set by the backend
        fileType: fileExtension,
        fileUrl: filePath,
      });
      
      // Update form fields
      if (setFieldValue) {
        setFieldValue('fileUrl', filePath);
        setFieldValue('fileName', fileName);
        setFieldValue('fileType', fileExtension);
        setFieldValue('type', fileExtension);
      }
    } else {
      setUploadedFile(null);
      if (setFieldValue) {
        setFieldValue('fileUrl', '');
        setFieldValue('fileName', '');
        setFieldValue('fileType', '');
        setFieldValue('type', '');
      }
    }
  };

  const handleSubmit = async (values: HandoutDTO) => {
    try {
      if (!values.fileUrl && !uploadedFile) {
        showToast.error(t("please_upload_file"));
        return;
      }

      // Construct proper URL for fileUrl
      const baseUrl = process.env.NEXT_PUBLIC_URL || '';
      const fileUrl = uploadedFile?.fileUrl || values.fileUrl;
      const fullFileUrl = fileUrl ? `${baseUrl}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}` : '';

      const handoutData: HandoutDTO = {
        ...values,
        fileUrl: fullFileUrl,
        fileName: uploadedFile?.fileName || values.fileName,
        fileSize: uploadedFile?.fileSize || values.fileSize,
        fileType: uploadedFile?.fileType || values.fileType,
        type: uploadedFile?.fileType || values.type,
      };

      let result;
      if (initialValues.id) {
        // Update existing handout
        result = await updateHandout(initialValues.id, handoutData);
      } else {
        // Create new handout
        result = await createHandout(handoutData);
      }

      if (result.success) {
        showToast.success(
          initialValues.id 
            ? t("handout_updated_successfully") 
            : t("handout_added_successfully")
        );
        onSubmit(handoutData);
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
                    <FontAwesomeIcon icon={faFileAlt} className="w-6 h-6 duotone-icon duotone-info" />
        <h2 className="text-xl font-semibold text-gray-900">
          {initialValues.id ? t("edit_handout") : t("add_handout")}
        </h2>
      </div>

      <Formik
        initialValues={{
          title: initialValues.title || "",
          description: initialValues.description || "",
          fileUrl: initialValues.fileUrl || "",
          fileName: initialValues.fileName || "",
          fileSize: initialValues.fileSize || 0,
          fileType: initialValues.fileType || "",
          type: initialValues.type || "",
          accessLevel: initialValues.accessLevel || "ENROLLED",
          isRequired: initialValues.isRequired ?? false,
          sortOrder: initialValues.sortOrder || 1,
          isActive: initialValues.isActive ?? true,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
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
                  error={touched.title && errors.title ? errors.title : undefined}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("access_level")} *
                </label>
                <SelectField
                  name="accessLevel"
                  value={values.accessLevel}
                  onChange={(name, value) => setFieldValue(name, value)}
                  options={accessLevelOptions}
                  placeholder={t("select_access_level")}
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("file")} *
              </label>
              <FileUploader
                label={t("upload_file")}
                subdirName="handouts"
                note={t("file_upload_note")}
                onChange={(filePath) => handleFileUpload(filePath, setFieldValue)}
                initialImageUrl={initialValues.fileUrl || null}
                isDocumentUploader={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("file_type")}
                </label>
                <SelectField
                  name="type"
                  value={values.type}
                  onChange={(name, value) => setFieldValue(name, value)}
                  options={fileTypeOptions}
                  placeholder={t("select_file_type")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("sort_order")}
                </label>
                <Input
                  name="sortOrder"
                  type="number"
                  placeholder={t("enter_sort_order")}
                  value={values.sortOrder}
                  onChange={handleChange}
                  error={touched.sortOrder && errors.sortOrder ? errors.sortOrder : undefined}
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
                  error={touched.fileSize && errors.fileSize ? errors.fileSize : undefined}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("is_required")}
                </label>
                <div className="flex items-center space-x-2">
                  <Toggler
                    checked={values.isRequired}
                    onChange={(checked) => setFieldValue("isRequired", checked)}
                  />
                  <span className="text-sm text-gray-600">
                    {values.isRequired ? t("required") : t("optional")}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("is_active")}
                </label>
                <div className="flex items-center space-x-2">
                  <Toggler
                    checked={values.isActive}
                    onChange={(checked) => setFieldValue("isActive", checked)}
                  />
                  <span className="text-sm text-gray-600">
                    {values.isActive ? t("active") : t("inactive")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="transparent"
                onClick={onCancel}
                disabled={isLoading}
                icon={<FontAwesomeIcon icon={faXmark} className="w-4 h-4 duotone-icon duotone-danger" />}
                label={t("buttons.cancel")}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                icon={<FontAwesomeIcon icon={faSave} className="w-4 h-4 duotone-icon duotone-success" />}
                label={isLoading ? t("buttons.saving") : t("buttons.save")}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
} 