"use client";
import { resetPassword } from "@/api/authService";
import Cookies from "js-cookie";
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
      const token = Cookies.get("tokenOTP");
      if (!token) {
        setPasswordError("No OTP token found. Please request a new OTP.");
        return;
      }
      const response = await resetPassword(values.password, token);
      if (response.success) {
        setIsSuccess(true);
        Cookies.remove("tokenOTP");
        setPasswordError(null);
        setTimeout(() => {
          window.location.href = "/authentication/login";
        }, 200);
      } else {
        setPasswordError(response.message || "Failed to reset the password. Please try again.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Password reset failed:", error);
      setPasswordError(error.message || "Failed to reset the password. Please try again.");
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
              msg="Password changed successfully. You can now log in with your new password."
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
