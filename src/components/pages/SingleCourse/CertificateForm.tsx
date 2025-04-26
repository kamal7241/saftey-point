import Certificate from "@/components/forms/course-steps/Certificate";
import Button from "@/components/ui/Button";
import { CertificateFormValues } from "@/types/forms.types";
import { getCertificateValidationSchema } from "@/utils/validation/courseValidation";
import { Form, Formik, FormikHelpers } from "formik";
import { useTranslations } from "next-intl";

interface CertificateFormProps {
  initialValues: Partial<CertificateFormValues>;
  onSubmit: (
    values: CertificateFormValues,
    helpers: FormikHelpers<CertificateFormValues>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => void | Promise<any>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function CertificateForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}: CertificateFormProps) {
  const t = useTranslations("common");
  const tValidation = useTranslations("validation");

  const fullInitialValues: CertificateFormValues = {
    certificateName: "",
    validate_date_interval: [null, null],
    issue_date: "",
    displayScore: "no",
    watermark: "no",
    ...initialValues,
  };

  return (
    <Formik
      initialValues={fullInitialValues}
      validationSchema={getCertificateValidationSchema(tValidation)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, handleChange, setFieldValue, errors }) => (
        <Form>
          <Certificate
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
