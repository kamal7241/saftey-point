export const runtime = "edge";
import ForgetForm from "@/components/authentication/ForgetForm";
import ArrowLeft from "@/components/ui/icons/ArrowLeft";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function Forget() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 sm:py-20 py-10">
      <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-2xl bg-white flex-col-reverse sm:flex-row">
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
              Forget your password?
            </h2>
            <p className="text-center text-black-400">
              {`Enter your email address and we'll send youa link to rest your password`}
            </p>
            <ForgetForm />
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
        <div className="auth-form-image">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/images/pages/forget.webp"
            alt="forget Image"
            fill
          />
        </div>
      </div>
    </div>
  );
}
