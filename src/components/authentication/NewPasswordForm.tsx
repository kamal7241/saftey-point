"use client";
import { resetPassword } from "@/api/authService";
import Input from "@/components/formsUI/Input";
import { passwordValidationSchema } from "@/utils/validation/authValidation";
import { ErrorMessage, Form, Formik } from "formik";
import { useState } from "react";
import Error from "../ui/icons/Error";
import SuccessMessage from "../ui/SuccessMessage";

export default function NewPasswordForm() {
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePasswordReset = async (values: { password: string }) => {
    try {
      // Call the API to reset the password
      const response = await resetPassword(values.password);
      //   Cookies.set("accessToken", response.tokens.access, {
      //     secure: true,
      //     httpOnly: false,
      //   });
      //   Cookies.set("refreshToken", response.tokens.refresh, {
      //     secure: true,
      //     httpOnly: false,
      //   });
      //   window.location.href = "/authentication/login";
      if (response.tokens.access) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      setPasswordError("Failed to reset the password. Please try again.");
    }
  };

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={passwordValidationSchema}
      onSubmit={handlePasswordReset}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form className="flex w-full flex-col gap-4">
          <div>
            <Input
              label="New Password"
              type="password"
              placeholder="New Password"
              value={values.password}
              onChange={handleChange}
              name="password"
            />
            <ErrorMessage name="password">
              {(msg) => (
                <div className="text-xs text-red-500 flex items-center mt-1.5 gap-1">
                  <Error />
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>

          <div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
            />
            <ErrorMessage name="confirmPassword">
              {(msg) => (
                <div className="text-xs text-red-500 flex items-center mt-1.5 gap-1">
                  <Error />
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>

          {passwordError && (
            <div className="text-xs text-red-500">{passwordError}</div>
          )}
          {isSuccess && (
            <SuccessMessage
              title="New Password updated successfully"
              msg="The password matches and is strong"
            />
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 w-full rounded-lg bg-primary py-3 text-center text-white transition-all hover:bg-primaryLight"
          >
            Confirm
          </button>
        </Form>
      )}
    </Formik>
  );
}
