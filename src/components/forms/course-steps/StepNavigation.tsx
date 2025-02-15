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
    <div className="relative h-[92px] w-[1032px]">
      {/* Main progress bar */}
      {/* <div className="absolute left-[109px] top-[29px] h-[0px] w-[822px] border border-[#6e7277]"></div>
      <div className="absolute left-[109px] top-[29px] h-[0px] w-[200px] border border-primary"></div> */}

      {steps.map((step, index) => {
        const isActive = index === currentStep;
        return (
          <div
            key={index}
            className={`inline-flex flex-col items-center justify-start gap-3 py-2`}
          >
            <div className="relative h-10 w-10">
              <div
                className={`w-10 h-10 left-0 top-0 absolute rounded-full ${
                  isActive ? "bg-priborder-primary" : "bg-[#6e7277]"
                }`}
              />
              <div data-svg-wrapper className="absolute left-[8px] top-[8px]">
                {step.icon}
              </div>
            </div>
            {/* Step Label */}
            <div
              className="h-6 self-stretch text-center font-['Jost'] text-base font-semibold leading-normal"
              style={{ color: isActive ? "#aa2d41" : "#6e7277" }}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
