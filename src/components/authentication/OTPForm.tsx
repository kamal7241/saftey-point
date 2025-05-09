"use client";
import { verifyOTP } from "@/api/authService";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import Error from "../ui/icons/Error";

const OTPForm = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timer logic
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

    try {
      const response = await verifyOTP({ otp });
      const { tokens } = response;
      Cookies.set("tokenOTP", tokens.access, { secure: true, httpOnly: false });
      window.location.href = "/authentication/new-password";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage("Invalid OTP try 123456");
    }
  };

  const resendCode = () => {
    setCanResend(false);
    setTimeLeft(59);
    console.log("Code resent successfully!");
  };

  return (
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
  );
};

export default OTPForm;
