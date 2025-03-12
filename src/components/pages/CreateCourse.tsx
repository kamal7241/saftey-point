"use client";
import Certificate from "@/components/forms/course-steps/Certificate";
import CourseInfo from "@/components/forms/course-steps/CourseInfo";
import Pricing from "@/components/forms/course-steps/Pricing";
import { CourseFormValues } from "@/types/forms.types";
import { Form, Formik, FormikValues } from "formik";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Exam from "../forms/course-steps/Exam";
import SessionStep from "../forms/course-steps/SessionStep";
import StepNavigation from "../forms/course-steps/StepNavigation";
import PageHeader from "../global/PageHeader";
import Award from "../ui/icons/Award";
import InfoCircle from "../ui/icons/InfoCircle";
import Moneys from "../ui/icons/Moneys";
import Session from "../ui/icons/Session";
import TaskSquare from "../ui/icons/TaskSquare";
// Update imports to include submitSession
import {
  submitCertificate,
  submitCourse,
  submitExam,
  submitSession,
} from "@/api/courseService";
import {
  getCertificateValidationSchema,
  getCourseInfoValidationSchema,
  getExamValidationSchema,
  getPricingValidationSchema,
  getSessionValidationSchema,
} from "@/utils/validation/courseValidation";
import { toast } from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import Popup from "../ui/Popup";
import SuccessMessage from "../ui/SuccessMessage";

export default function CreateCourse() {
  const t = useTranslations();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [examId, setExamId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
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
  console.log("courseId>>", courseId);
  console.log("certificateId>>", certificateId);
  console.log("examId>>", examId);
  const StepComponents = [CourseInfo, Pricing, Certificate, Exam, SessionStep];

  const validationSchemas = [
    getCourseInfoValidationSchema(t),
    getPricingValidationSchema(t),
    getCertificateValidationSchema(t),
    getExamValidationSchema(t),
    getSessionValidationSchema(t),
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
      const result = await submitCourse(
        values as CourseFormValues,
        currentStep
      );
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
      if (examId) {
        // If examId exists, proceed to next step
        setFormData((prev) => ({ ...prev, ...values }));
        setCurrentStep((prev) => prev + 1);
      } else {
        // If no examId, create new exam
        const result = await submitExam(values, courseId);
        if (result.success && result.innerData?.id) {
          setExamId(result.innerData.id.toString());
          setFormData((prev) => ({ ...prev, ...values }));
        } else {
          toast.error(result.error || t("messages.error_creating_exam"));
          return;
        }
      }
    } else if (currentStep === 4 && courseId) {
      // Format session time values before submission
      const formattedValues = {
        ...values,
        session_time: Array.isArray(values.session_time) 
          ? values.session_time.map(time => 
              time instanceof Date ? time.toISOString() : time
            )
          : values.session_time,
        session_date: values.session_date instanceof Date 
          ? values.session_date.toISOString().split('T')[0]
          : values.session_date
      };

      const result = await submitSession(formattedValues, courseId);
      debugger;
      if (result.success && result.innerData?.id) {
        setFormData((prev) => ({ ...prev, ...values }));
        setShowSuccess(true);
        toast.success(t("messages.course_created_successfully"));
      } else {
        toast.error(result.error || t("messages.error_creating_session"));
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

  const CurrentStepComponent = StepComponents[currentStep];


  const handleClose = () => {
    if (courseId) {
      router.push(`/dashboard/courses-management/list/${courseId}`);
    }
  };

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

      <Popup isOpen={showSuccess} onClose={handleClose}>
        <div className="py-10">
          <SuccessMessage
            title={"Successfully Added"}
            msg={"Thank you for filling out your information!"}
            bigger
          />
        </div>
      </Popup>
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
            // onSubmit={
            //   currentStep === steps.length - 1 ? handleSubmit : nextStep
            // }
            onSubmit={nextStep}
          >
            {({ values, handleChange, errors, setFieldValue }) => (
              <Form className="">
                <CurrentStepComponent
                  values={values}
                  handleChange={handleChange}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  examId={currentStep === 3 && examId ? examId : undefined}
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
