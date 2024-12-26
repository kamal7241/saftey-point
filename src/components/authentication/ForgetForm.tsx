"use client";
import { forget } from "@/api/authService";
import Input from "@/components/formsUI/Input";
import { forgetValidationSchema } from "@/utils/validation/authValidation";
import { ErrorMessage, Form, Formik } from "formik";
import Cookies from "js-cookie";
import { useState } from "react";
import Direct from "../ui/icons/Direct";
import Error from "../ui/icons/Error";

export default function ForgetForm() {
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleForget = async (values: { email: string }) => {
    try {
      const response = await forget(values.email);
      const { tokens } = response;
      Cookies.set("tokenOTP", tokens.access, {
        secure: true,
        httpOnly: false,
      });
      window.location.href = "/authentication/otp";
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Invalid email or password.");
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
