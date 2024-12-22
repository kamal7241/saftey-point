"use client";
import { login } from "@/api/authService";
import Input from "@/components/forms/Input";
import { Link } from "@/i18n/routing";
import { loginValidationSchema } from "@/utils/validation/authValidation";
import { ErrorMessage, Form, Formik } from "formik";
import Cookies from "js-cookie";
import Image from "next/image";
import { useState } from "react";
import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";

export default function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await login(values.email, values.password);
      // Extract user and tokens from response
      const { user, tokens } = response;
      Cookies.set("accessToken", tokens.access, {
        secure: true,
        httpOnly: false,
      }); // Set secure to true in production
      Cookies.set("refreshToken", tokens.refresh, {
        secure: true,
        httpOnly: false,
      });
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
      {({ values, handleChange, isSubmitting,errors }) => (
        <Form className="flex w-full flex-col gap-4">
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              name="email"
              error={errors.email}
            />
            <ErrorMessage name="email">
              {(msg) => <ErrorMessageWrappers msg={msg} />}
            </ErrorMessage>
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              name="password"
              error={errors.password}
              togglePasswordVisibility={() => {}}
            />
            <ErrorMessage name="password">
              {(msg) => (
                <ErrorMessageWrappers msg={msg} />
              )}
            </ErrorMessage>
          </div>

          {loginError && (
            <ErrorMessageWrappers msg={loginError} />
          )}
          <div className="flex justify-between">
            <label
              htmlFor="remember-me"
              className="flex items-center gap-2 cursor-pointer"
            >
              <input type="checkbox" id="remember-me" className="peer hidden" />
              <Image
                src="/images/icons/checkbox.svg"
                className="peer-checked:hidden"
                width="24"
                height="24"
                alt=""
              />
              <Image
                src="/images/icons/checkbox_checked.svg"
                className="hidden peer-checked:block"
                width="24"
                height="24"
                alt=""
              />
              <span className="select-none text-sm text-gray-300">
                Remember me
              </span>
            </label>
            <Link
              href="/authentication/forget"
              className="text-primaryLight hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

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
