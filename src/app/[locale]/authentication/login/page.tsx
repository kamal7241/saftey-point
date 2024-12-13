import LoginForm from "@/components/authentication/LoginForm";
import Image from "next/image";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-20">
      <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-2xl bg-white">
        <div className="h-[824px] w-1/2 px-14 pt-20">
          <div className="flex flex-col items-center justify-center gap-4">
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
            <p className="text-center text-black">
              Welcome back! Please login to your account.
            </p>
            <LoginForm />
          </div>
        </div>
        <div className="relative w-1/2 overflow-hidden rounded-l-4xl">
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
