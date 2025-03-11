"use client";
import { useState } from "react";
import { Formik, Form, FormikValues } from "formik";
import * as Yup from "yup";
import CourseInfo from "@/components/forms/course-steps/CourseInfo";
import Pricing from "@/components/forms/course-steps/Pricing";
import Certificate from "@/components/forms/course-steps/Certificate";
import { CourseFormValues } from "@/types/forms.types";
import PageHeader from "../global/PageHeader";
import { useTranslations } from "next-intl";
import StepNavigation from "../forms/course-steps/StepNavigation";
import InfoCircle from "../ui/icons/InfoCircle";
import Moneys from "../ui/icons/Moneys";
import Award from "../ui/icons/Award";
import TaskSquare from "../ui/icons/TaskSquare";
import Session from "../ui/icons/Session";
import { getCourseInfoValidationSchema, getPricingValidationSchema } from "@/utils/validation/dashboardValidation";
import Exam from "../forms/course-steps/Exam";
import SessionStep from "../forms/course-steps/SessionStep";
import { submitCertificate, submitCourse, submitExam } from "@/api/courseService";
import { toast } from "react-hot-toast";

export default function CreateCourse() {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    courseTitle: "",
    description: "",
    status: "DRAFT",
    prerequisites: "NONE",
    validity: "",
    courseCover: "",
    level: "BASIC",
    language: "en",
    maxAttendees: "",
    medicalTest: "no",
    price: "",
    certificate: "",
    certificateName: "",
    validate_date_interval: ["", ""],
    issue_date: "",
    displayScore: "no",
    watermark: "no",
  });
console.log('courseId>>',courseId)
console.log('certificateId>>',certificateId)
  const StepComponents = [CourseInfo, Pricing, Certificate, Exam, SessionStep];

  const validationSchemas = [
    getCourseInfoValidationSchema(t),
    getPricingValidationSchema(t),
    Yup.object({
      certificateName: Yup.string().required(t("validation.certificate.name.required")),
      validate_date_interval: Yup.array()
        .of(Yup.string().required())
        .min(2)
        .required(t("validation.certificate.date_interval.required")),
      issue_date: Yup.string().required(t("validation.certificate.issue_date.required")),
      displayScore: Yup.string().required(t("validation.certificate.display_score.required")),
      watermark: Yup.string().required(t("validation.certificate.watermark.required")),
    }),
  ];
  
  const steps = [
    { label: "Course Info", icon: <InfoCircle /> },
    { label: "Pricing", icon: <Moneys /> },
    { label: "Certificate", icon: <Award /> },
    { label: "Exam", icon: <TaskSquare /> },
    { label: "Session", icon: <Session /> },
  ];
  // Update nextStep function
  const nextStep = async (values: FormikValues) => {
    if (currentStep === 0) {
      const result = await submitCourse(values as CourseFormValues, currentStep);
      if (result.success && result.innerData?.id) {
        setCourseId(result.innerData.id.toString());
        setFormData((prev) => ({ ...prev, ...values }));
        setCurrentStep((prev) => prev + 2); // Skip pricing step
      } else {
        toast.error(result.error || t("messages.error_creating_course"));
        return;
      }
    } else if (currentStep === 2 && courseId) {
      const result = await submitCertificate(values, courseId);
      if (result.success && result.innerData?.id) {
        setCertificateId(result.innerData.id.toString());
        setFormData((prev) => ({ ...prev, ...values }));
        setCurrentStep((prev) => prev + 1);
      } else {
        toast.error(result.error || t("messages.error_creating_certificate"));
        return;
      }
    } else if (currentStep === 3 && courseId) {
      const result = await submitExam(values, courseId);
      if (result.success && result.innerData?.id) {
        setFormData((prev) => ({ ...prev, ...values }));
        setCurrentStep((prev) => prev + 1);
      } else {
        toast.error(result.error || t("messages.error_creating_exam"));
        return;
      }
    } else {
      setFormData((prev) => ({ ...prev, ...values }));
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };
  

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (values: CourseFormValues) => {
    try {
      const result = await submitCourse(values, currentStep);
      
      if (result.success) {
        toast.success(t("messages.course_created_successfully"));
      } else {
        toast.error(result.error || t("messages.error_creating_course"));
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(t("messages.error_creating_course"));
    }
  };

  const CurrentStepComponent = StepComponents[currentStep];

  const breadcrumbItems = [
    { label: t("common.home"), href: "/" },
    {
      label: t("common.courses-management"),
      href: "/dashboard/courses-management",
    },
    {
      label: t("common.courses_list"),
      href: "/dashboard/courses-management/list",
    },
  ];
  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("common.courses_list")}
      />
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
        <div className="flex flex-col gap-6 pb-20">
          <h3 className="heading3">{t("common.add_course")}</h3>
          <p className="textRegular mt-1.5">{t("common.form_subtitle")}</p>
          {/* Step Navigation */}
          <StepNavigation steps={steps} currentStep={currentStep} />

          {/* Formik Wrapper */}
          <Formik
            initialValues={formData}
            validationSchema={validationSchemas[currentStep]}
            onSubmit={
              currentStep === steps.length - 1 ? handleSubmit : nextStep
            }
          >
            {({ values, handleChange, errors, setFieldValue }) => (
              <Form className="">
                <CurrentStepComponent
                  values={values}
                  handleChange={handleChange}
                  errors={errors}
                  setFieldValue={setFieldValue}
                />

                {/* Navigation Buttons */}
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-red-500 px-4 py-2 text-white disabled:opacity-50"
                  >
                    {currentStep === steps.length - 1 ? "Submit" : "Next"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
