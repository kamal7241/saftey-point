import React from "react";
import Error from "./icons/Error";
interface ErrorMessageWrappersProps {
    msg: string; // Define the prop type
  }
export default function ErrorMessageWrappers({ msg }: ErrorMessageWrappersProps) {
  return (
    <div className="text-xs text-red-400 flex items-center mt-1.5 gap-1 w-full">
      <Error />
      {msg}
    </div>
  );
}
