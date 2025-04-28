/* eslint-disable @typescript-eslint/no-explicit-any */
import Exam from "@/components/forms/course-steps/Exam";
import Button from "@/components/ui/Button";
// import { ExamFormValues } from "@/types/forms.types";
import { getExamValidationSchema } from "@/utils/validation/courseValidation";
import { Form, Formik, FormikHelpers } from "formik";
import { useTranslations } from "next-intl";

interface ExamFormProps {
  initialValues: Partial<any>;
  onSubmit: (
    values: any,
    helpers: FormikHelpers<any>
  ) => void | Promise<any>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ExamForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}: ExamFormProps) {
  const t = useTranslations("common");
  const tValidation = useTranslations("validation");

  const fullInitialValues: any = {
    examName: "",
    examType: "",
    examDuration: 0,
    totalMarks: 0,
    passMarks: 0,
    instructions: "",
    ...initialValues,
  };

  return (
    <Formik
      initialValues={fullInitialValues}
      validationSchema={getExamValidationSchema(tValidation)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, handleChange, setFieldValue, errors }) => (
        <Form>
          <Exam
            values={values}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            errors={errors}
          />

          <div className="mt-6 flex justify-end gap-4 border-t border-gray-200 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
              label={t("buttons.cancel")}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              label={isLoading ? t("buttons.saving") : t("buttons.save")}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}