import React from "react";
import { Formik, Form, FormikValues } from "formik";
import { useTranslations } from "next-intl";
import { CourseFormValues } from "@/types/forms.types";
import { getCourseInfoValidationSchema } from "@/utils/validation/courseValidation";
import CourseInfo from "../../forms/course-steps/CourseInfo";
import Button from "../../ui/Button";

interface CourseInfoFormProps {
  initialValues: Partial<CourseFormValues>;
  onSubmit: (values: FormikValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function CourseInfoForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}: CourseInfoFormProps) {
  const tValidation = useTranslations("validation");
  const t = useTranslations("common");

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getCourseInfoValidationSchema(tValidation)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, handleChange, errors, setFieldValue }) => (
        <Form>
          <CourseInfo
            values={values}
            handleChange={handleChange}
            errors={errors}
            setFieldValue={setFieldValue}
          />
          <div className="mt-6 flex justify-end gap-4">
            <Button
              label={t("buttons.cancel")}
              onClick={onCancel}
              variant="transparent"
              type="button"
            />
            <Button
              label={t("buttons.save")}
              type="submit"
              variant="primary"
              disabled={isLoading}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}