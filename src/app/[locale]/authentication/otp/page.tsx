export const runtime = "edge";
import OTPForm from "@/components/authentication/OTPForm";
import ArrowLeft from "@/components/ui/icons/ArrowLeft";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function OTPPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-20">
      <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-2xl bg-white">
        <div className="auth-form-parent">
          <div className="auth-form-container">
            <Image
              className="mb-4"
              src="/images/logo/logo.webp"
              alt="Logo"
              width="138"
              height="158"
            />
            <h2 className="text-center text-2xl font-medium leading-6 text-primary">
              Code Verification
            </h2>
            <p className="text-center text-black-400">
              Enter the code we sent to the email
              <br />
              Michxxx@gmail.com
            </p>
            <OTPForm />
            <Link
              href="/authentication/login"
              className="mt-auto text-center text-black-400 hover:underline flex items-center gap-2 justify-center"
            >
              <span className="w-6">
                <ArrowLeft />
              </span>
              Back to login
            </Link>
          </div>
        </div>
        <div className="relative w-1/2 overflow-hidden rounded-l-4xl">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/images/pages/otp.webp"
            alt="Login Image"
            fill
          />
        </div>
      </div>
    </div>
  );
}
