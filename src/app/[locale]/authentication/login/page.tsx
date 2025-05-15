export const runtime = "edge";
import LoginForm from "@/components/authentication/LoginForm";
import Image from "next/image";

export default function Login() {
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
              Aiming to supply our customers all solutions needed during
              operation
            </h2>
            <p className="text-center text-black-400">
              Welcome back! Please login to your account.
            </p>
            <LoginForm />
          </div>
        </div>
        <div className="auth-form-image">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/images/pages/login.webp"
            alt="Login Image"
            fill
          />
        </div>
      </div>
    </div>
  );
}
