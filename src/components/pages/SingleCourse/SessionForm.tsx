/* eslint-disable @typescript-eslint/no-explicit-any */
import SessionStep from "@/components/forms/course-steps/SessionStep";
import Button from "@/components/ui/Button";
import { getSessionValidationSchema } from "@/utils/validation/courseValidation";
import { Form, Formik, FormikHelpers } from "formik";
import { useTranslations } from "next-intl";

interface SessionFormProps {
  initialValues: Partial<any>;
  onSubmit: (
    values: any,
    helpers: FormikHelpers<any>
  ) => void | Promise<any>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function SessionForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}: SessionFormProps) {
  const t = useTranslations("common");
  const tValidation = useTranslations("validation");

  const fullInitialValues: any = {
    sessionName: "",
    trainer: "",
    assistant: "",
    assessor: "",
    description: "",
    scheduleType: "",
    session_date: "",
    session_time: "",
    ...initialValues,
  };

  return (
    <Formik
      initialValues={fullInitialValues}
      validationSchema={getSessionValidationSchema(tValidation)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, handleChange, setFieldValue, errors }) => (
        <Form>
          <SessionStep
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