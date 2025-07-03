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

  const handleFormSubmit = async (values: FormikValues) => {
    try {
      // Convert numeric string values to numbers
      const formValues = {
        ...values,
        maxAttendees: values.maxAttendees ? String(values.maxAttendees) : "",
        languageId: values.languageId ? String(values.languageId) : "",
        levelId: values.levelId ? String(values.levelId) : "",
        prerequisiteId: values.prerequisiteId ? String(values.prerequisiteId) : "",
        facilityId: values.facilityId ? String(values.facilityId) : "",
      };
      await onSubmit(formValues);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <Formik
        initialValues={initialValues}
        validationSchema={getCourseInfoValidationSchema(tValidation)}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, handleChange, errors, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            <CourseInfo
              values={values}
              handleChange={handleChange}
              errors={errors}
              setFieldValue={setFieldValue}
            />
            
            <div className="mt-8 flex justify-end gap-4 border-t pt-4">
              <Button
                label={t("buttons.cancel")}
                onClick={onCancel}
                variant="transparent"
                type="button"
                className="min-w-[100px]"
              />
              <Button
                label={t("buttons.save")}
                type="submit"
                variant="primary"
                disabled={isLoading || isSubmitting}
                className="min-w-[100px]"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}