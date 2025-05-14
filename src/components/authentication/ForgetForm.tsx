"use client";
import { forget } from "@/api/authService";
import Input from "@/components/formsUI/Input";
import { forgetValidationSchema } from "@/utils/validation/authValidation";
import { ErrorMessage, Form, Formik } from "formik";
import { useState } from "react";
import Direct from "../ui/icons/Direct";
import Error from "../ui/icons/Error";

export default function ForgetForm() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleForget = async (values: { email: string }) => {
    setLoginError(null);
    setSuccessMessage(null);
    try {
      const response = await forget(values.email);
      if (response.success) {
        setSuccessMessage(response.innerData?.message || "OTP sent successfully.");
        // Optionally, you can add a delay before redirecting
        setTimeout(() => {
          window.location.href = "/authentication/otp";
        }, 1200);
      } else {
        setLoginError(response.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Forget password failed:", error);
      setLoginError("An error occurred. Please try again.");
    }
  };
  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={forgetValidationSchema}
      onSubmit={handleForget}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form className="flex w-full flex-col gap-4">
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              name="email"
              iconSVG={<Direct />}
            />
            <ErrorMessage name="email">
              {(msg) => (
                <div className="text-xs text-red-500 flex items-center mt-1.5 gap-1">
                  <Error />
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>

          {loginError && (
            <div className="text-xs text-red-500">{loginError}</div>
          )}
          {successMessage && (
            <div className="text-xs text-green-600">{successMessage}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 w-full rounded-lg bg-primary py-3 text-center text-white transition-all hover:bg-primaryLight"
          >
            Send Verification Code
          </button>
        </Form>
      )}
    </Formik>
  );
}
