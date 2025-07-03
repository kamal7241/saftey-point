"use client";
import Input from "@/components/formsUI/Input";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { loginValidationSchema } from "@/utils/validation/authValidation";
import { ErrorMessage, Form, Formik } from "formik";
import Image from "next/image";
import { useState } from "react";
import ErrorMessageWrappers from "../ui/ErrorMessageWrappers";
import { useAuth } from "@/contexts/UserProvider"; // Import useAuth

export default function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { login: authLogin, isLoading } = useAuth(); // Use the login function and loading state from AuthContext
  const t = useTranslations("messages");

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoginError(null);
    setIsAuthenticating(true);
    try {
      await authLogin(values.email, values.password);
      // Navigation is handled within the authLogin function in UserProvider
    } catch (error) {
      console.error("Login failed:", error);
      
      // Always use the actual error message from the API if available
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        // Fallback to translated message only if no specific error message
        setLoginError(t("authentication_error"));
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Show loading overlay if authentication is in progress
  if (isAuthenticating || isLoading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">{t("signing_in")}</p>
            <p className="text-gray-500 text-sm mt-2">{t("redirecting_to_dashboard")}</p>
          </div>
        </div>
        {/* Keep the form visible but disabled underneath */}
        <div className="opacity-50 pointer-events-none">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
          >
            {({ values, handleChange, errors, dirty, isValid }) => (
              <Form className="flex w-full flex-col gap-4">
                <div>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={(e) => handleChange(e)}
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
                    onChange={(e) => handleChange(e)}
                    name="password"
                    error={errors.password}
                    togglePasswordVisibility={() => {}}
                  />
                  <ErrorMessage name="password">
                    {(msg) => <ErrorMessageWrappers msg={msg} />}
                  </ErrorMessage>
                </div>

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
                  disabled={!dirty || !isValid}
                  className="mt-3 w-full rounded-lg bg-primary py-3 text-center text-white transition-all hover:bg-primaryLight disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("sign_in")}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginValidationSchema}
      onSubmit={handleLogin}
    >
      {({ values, handleChange, isSubmitting, errors, dirty, isValid }) => (
        <Form className="flex w-full flex-col gap-4">
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={(e) => handleChange(e)}
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
              onChange={(e) => handleChange(e)}
              name="password"
              error={errors.password}
              togglePasswordVisibility={() => {}}
            />
            <ErrorMessage name="password">
              {(msg) => <ErrorMessageWrappers msg={msg} />}
            </ErrorMessage>
          </div>

          {loginError && <ErrorMessageWrappers msg={loginError} />}
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
            disabled={isSubmitting || !dirty || !isValid}
            className="mt-3 w-full rounded-lg bg-primary py-3 text-center text-white transition-all hover:bg-primaryLight disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t("signing_in") : t("sign_in")}
          </button>
        </Form>
      )}
    </Formik>
  );
}
