import TickCircle from "@/components/ui/icons/TickCircle";
import React from "react";

interface StepNavigationProps {
  steps: { label: string; icon: React.ReactNode }[];
  currentStep: number;
}

export default function StepNavigation({
  steps,
  currentStep,
}: StepNavigationProps) {
  return (
    <div className="relative flex items-center justify-between px-10">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isPass = index < currentStep;
        return (
          <div
            key={index}
            className={`flex items-start w-full ${
              index === steps.length - 1
                ? "after:hidden"
                : "after:content-[''] after:w-full after:h-[1px] after:inline-block after:mt-5"
            } ${isActive ? "after:bg-primary" : "after:bg-gray-901"}`}
          >
            <div className="flex flex-col gap-3 items-center justify-center w-10">
              <div className="relative">
                <div
                  className={`rounded-full size-10 flex items-center justify-center ${
                    isActive
                      ? "bg-primary"
                      : isPass
                      ? "bg-green-400"
                      : "bg-gray-901"
                  }`}
                >
                  <div data-svg-wrapper className="m-auto">
                    {isPass ? <TickCircle /> : step.icon}
                  </div>
                </div>
              </div>
              <span
                className={`font-semibold whitespace-nowrap ${
                  isActive
                    ? "text-primary"
                    : isPass
                    ? "text-green-400"
                    : "text-gray-901"
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
