"use client";
import { login } from "@/api/authService";
import Input from "@/components/forms/Input";
import { loginValidationSchema } from "@/utils/validation/loginValidation";
import { ErrorMessage, Form, Formik } from "formik";
import { useState } from "react";
import Cookies from "js-cookie";

export default function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await login(values.email, values.password);
      // Extract user and tokens from response
      const { user, tokens } = response;
      Cookies.set("accessToken", tokens.access, { secure: true, httpOnly: false }); // Set secure to true in production
      Cookies.set("refreshToken", tokens.refresh, { secure: true, httpOnly: false });
      console.log("User data:", user);
      window.location.href = "/dashboard";

    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Invalid email or password.");
    }
  };
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginValidationSchema}
      onSubmit={handleLogin}
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
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-xs text-red-500"
            />
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              name="password"
              togglePasswordVisibility={() => {}}
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-xs text-red-500"
            />
          </div>

          {loginError && (
            <div className="text-xs text-red-500">{loginError}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 w-full rounded-lg bg-primary py-3 text-center text-white transition-all hover:bg-primaryLight"
          >
            Sign In
          </button>
        </Form>
      )}
    </Formik>
  );
}
