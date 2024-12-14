import Image from "next/image";
import Button from "./ui/Button";

export default function NotDevelopedYet() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 gap-6">
      <div className=" w-full">
        <div className="relative aspect-[1800/1002] max-w-screen-md m-auto">
          <Image
            src="/images/under-construction.jpg"
            alt="Not Developed Yet"
            fill
            className="object-cover"
          />
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-gray-800">
        Feature Not Developed Yet
      </h1>
      <p className="text-gray-600 mt-2">
        This feature is under construction. Stay tuned for updates!
      </p>
      <Button label="Go to Dashboard" href="/dashboard" />
    </div>
  );
}
