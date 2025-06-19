/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { verifyOTP } from "@/api/authService";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import Error from "../ui/icons/Error";

const OTPForm = ({ email: propEmail }: { email?: string }) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>(propEmail || "");

  useEffect(() => {
    if (!propEmail) {
      const storedEmail = localStorage.getItem("forgotEmail");
      if (storedEmail) setEmail(storedEmail);
    }
  }, [propEmail]);

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
    } else {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const response = await verifyOTP({ otp, email });
      if (response.success) {
        const accessToken = response.innerData?.accessToken;
        Cookies.set("tokenOTP", accessToken, { 
          secure: process.env.NODE_ENV === 'production', 
          httpOnly: false,
          sameSite: 'strict',
          path: '/'
        });
        localStorage.removeItem("forgotEmail");
        window.location.href = "/authentication/new-password";
      } else {
        setErrorMessage(response.message || "Invalid OTP");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Invalid OTP");
    }
  };

  const resendCode = async () => {
    setCanResend(false);
    setTimeLeft(59);
    setErrorMessage(null);
    try {
      if (!email) {
        setErrorMessage("No email found to resend code.");
        setCanResend(true);
        return;
      }
      await import("@/api/authService").then(({ forget }) => forget(email));
      // Optionally, show a success message (could use a toast or set a state)
      // For now, just log
      console.log("Code resent successfully!");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to resend code.");
      setCanResend(true);
    }
  };

  return (
    <>

      <p className="text-center text-black-400">
        Enter the code we sent to the email
        <br />
        {email}
      </p>
      <form onSubmit={handleOTP} className="flex flex-col gap-4 items-center w-full">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          shouldAutoFocus
          inputStyle={{
            width: "3rem",
            height: "3rem",
            margin: "0 0.25rem",
            fontSize: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            textAlign: "center",
          }}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
        />

        {errorMessage && (
          <div className="errorMsg flex items-center text-red-500 gap-2">
            <Error />
            {errorMessage}
          </div>
        )}

        <button type="submit" className="auth-submit-btn">
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
          <p className="mt-2 text-sm text-black-400">
            You can resend the code within 0:{timeLeft.toString().padStart(2, "0")} seconds
          </p>
        )}
      </form>
    </>
  );
};

export default OTPForm;
