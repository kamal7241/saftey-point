"use client";
import { useState } from "react";
import { Formik, Form, FormikValues } from "formik";
import * as Yup from "yup";
import CourseInfo from "@/components/forms/course-steps/CourseInfo";
import Pricing from "@/components/forms/course-steps/Pricing";
import Certificate from "@/components/forms/course-steps/Certificate";
import { CourseFormValues } from "@/types/forms.types";

const steps = ["Course Info", "Pricing", "Certificate"];

export default function CreateCourse() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    price: "",
    certificate: "",
  });

  const StepComponents = [CourseInfo, Pricing, Certificate];

  const validationSchemas = [
    Yup.object({
      courseName: Yup.string().required("Course Name is required"),
      description: Yup.string().required("Description is required"),
    }),
    Yup.object({
      price: Yup.number().positive().required("Price is required"),
    }),
    Yup.object({
      certificate: Yup.string().required("Please select an option"),
    }),
  ];

  const nextStep = (values: FormikValues) => {
    setFormData((prev) => ({ ...prev, ...values }));
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (values: CourseFormValues) => {
    setFormData(values);
    console.log("Final Form Data:", values);
    alert("Form submitted successfully!");
    // API call example: 
    // await fetch("/api/create-course", { method: "POST", body: JSON.stringify(values) });
  };

  const CurrentStepComponent = StepComponents[currentStep];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Step Navigation */}
      <div className="flex justify-between items-center mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 text-center p-2 border-b-2 ${
              index === currentStep ? "border-red-500 font-bold" : "border-gray-300"
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Formik Wrapper */}
      <Formik
        initialValues={formData}
        validationSchema={validationSchemas[currentStep]}
        onSubmit={currentStep === steps.length - 1 ? handleSubmit : nextStep}
      >
        {({ values, handleChange, handleBlur, errors }) => (
          <Form className="p-6 border rounded-lg shadow-md">
            <CurrentStepComponent values={values} handleChange={handleChange} handleBlur={handleBlur} errors={errors} />

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
              >
                {currentStep === steps.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
