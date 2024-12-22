"use client";
import { verifyOTP } from "@/api/authService";
import { Form, Formik } from "formik";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Error from "../ui/icons/Error";

const OTPForm = () => {
  const [otpFields, setOtpFields] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Add state for error message

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
    } else {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Focus handling
  useEffect(() => {
    if (focusIndex !== null) {
      const nextInput = document.getElementById(
        `otp${focusIndex}`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }, [focusIndex]);

  const handleOTP = async () => {
    const otp = otpFields.join("");
    try {
      const response = await verifyOTP({ otp });
      const { tokens } = response;
      Cookies.set("tokenOTP", tokens.access, { secure: true, httpOnly: false });
      window.location.href = "/authentication/new-password";
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage("Invalid OTP try 123456");
      } else {
        // Fallback for unknown error types
        setErrorMessage("Invalid OTP try 123456");
      }
    }
  };

  // Handle input changes
  const handleChange = (value: string, index: number) => {
    const updatedOtpFields = [...otpFields];
    updatedOtpFields[index] = value;
    setOtpFields(updatedOtpFields);

    // If the user has entered a value and it is not the last field, move to the next input
    if (value.length === 1 && index < otpFields.length - 1) {
      setFocusIndex(index + 1); // Focus the next input
    } else if (value === "" && index > 0) {
      // If the field is empty and it's not the first one, focus on the previous input
      setFocusIndex(index - 1);
    }
  };

  // Handle resend
  const resendCode = () => {
    setCanResend(false);
    setTimeLeft(59);
    console.log("Code resent successfully!");
  };

  return (
    <Formik initialValues={{}} onSubmit={handleOTP}>
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4 items-center w-full">
          <div className="flex gap-2 w-full">
            {otpFields.map((value, index) => (
              <input
                key={index}
                id={`otp${index}`}
                type="text"
                maxLength={1}
                value={value || (focusIndex === index ? "" : "-")}
                placeholder={focusIndex === index ? "" : "-"}
                onChange={(e) => handleChange(e.target.value, index)}
                onFocus={() => setFocusIndex(index)}
                onBlur={() => {
                  if (otpFields[index] === "") setFocusIndex(null);
                }}
                className={`rounded border text-center w-full aspect-square ${
                  index > 0 && otpFields[index - 1]
                    ? "border-gray-101"
                    : "border-black"
                }`}
                disabled={index > 0 && otpFields[index - 1] === ""}
              />
            ))}
          </div>
          {errorMessage && (
            <div className="errorMsg">
              <Error />
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="auth-submit-btn"
          >
            Send Verification Code
          </button>

          {canResend ? (
            <button
              type="button"
              onClick={resendCode}
              className="mt-2 text-sm text-blue-500 underline"
            >
              Resend Code
            </button>
          ) : (
            <p className="mt-2 text-sm text-black">
              You can resend the code within 0:
              {timeLeft.toString().padStart(2, "0")} seconds
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default OTPForm;
