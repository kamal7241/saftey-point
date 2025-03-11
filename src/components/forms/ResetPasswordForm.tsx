"use client";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../ui/Button";
import Input from "../formsUI/Input";
import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";

interface ResetPasswordFormProps {
  onClose: () => void;
  onSubmit: (newPassword: string) => Promise<void>;
}

export default function ResetPasswordForm({
  onClose,
  onSubmit,
}: ResetPasswordFormProps) {
  const t = useTranslations();

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .required(t("validation.required"))
      .min(8, t("validation.password_min_length")),
    confirmPassword: Yup.string()
      .required(t("validation.required"))
      .oneOf([Yup.ref("newPassword")], t("validation.passwords_must_match")),
  });

  return (
    <Formik
      initialValues={{ newPassword: "", confirmPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit(values.newPassword);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="w-full space-y-4">
          <div>
            <Field
              as={Input}
              type="password"
              name="newPassword"
              label={t("common.new_password")}
              placeholder={t("common.enter_new_password")}
            />
            <ErrorMessage name="newPassword">
              {(msg) => <ErrorMessageWrappers msg={msg} />}
            </ErrorMessage>
          </div>

          <div>
            <Field
              as={Input}
              type="password"
              name="confirmPassword"
              label={t("common.confirm_password")}
              placeholder={t("common.confirm_new_password")}
            />
            <ErrorMessage name="confirmPassword">
              {(msg) => <ErrorMessageWrappers msg={msg} />}
            </ErrorMessage>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              label={t("common.buttons.cancel")}
              onClick={onClose}
              variant="transparent"
              padding="py-3 px-4"
            />
            <Button
              label={t("common.buttons.submit")}
              type="submit"
              variant="primary"
              padding="py-3 px-4"
              disabled={isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
