"use client";
import {
  updateCertificate,
  updateCourse,
  updateCoursePricing,
} from "@/api/courseService";
import {
  CertificateFormValues,
  CourseFormValues,
  PricingFormValues,
} from "@/types/forms.types";
import { showToast } from "@/utils/toast";
import { FormikValues } from "formik";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import PageHeader from "../global/PageHeader";
import { useCourseData } from "./SingleCourse/useCourseData";
import CourseInfoDisplay from "./SingleCourse/CourseInfoDisplay";
import CourseInfoForm from "./SingleCourse/CourseInfoForm";
import PricingTabContent from "./SingleCourse/PricingTabContent";
import ExamTabContent from "./SingleCourse/ExamTabContent";
import CertificateTabContent from "./SingleCourse/CertificateTabContent";
import SessionsTabContent from "./SingleCourse/SessionsTabContent";
import EnrollmentsTabContent from "./SingleCourse/EnrollmentsTabContent";
import CourseHeaderActions from "./SingleCourse/CourseHeaderActions";
import CourseTabs from "./SingleCourse/CourseTabs";
import PricingForm from "./SingleCourse/PricingForm";
import CertificateForm from "./SingleCourse/CertificateForm";

interface SingleCourseProps {
  courseID: string;
}

type ActiveTab =
  | "course_info"
  | "pricing"
  | "exam"
  | "certificate"
  | "sessions"
  | "enrollments";

export default function SingleCourse({ courseID }: SingleCourseProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [editingPricingId, setEditingPricingId] = useState<number | null>(null);
  const [isEditingCertificate, setIsEditingCertificate] = useState(false);
  const [editingCertificateId, setEditingCertificateId] = useState<
    number | null
  >(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("course_info");

  const {
    courseData,
    pricingData,
    examData,
    certificateData,
    sessionData,
    enrollmentsData,
    loading: initialLoading,
    tabLoading,
    error,
    refetchCourseData,
    refetchPricingData,
    refetchCertificateData,
    refetchExamData,
    refetchSessionData,
    refetchEnrollmentsData
  } = useCourseData(courseID, activeTab);

  const getInitialFormValues = (): Partial<CourseFormValues> => {
    if (!courseData) return {};
    return {
      courseTitle: courseData.title,
      description: courseData.description,
      status: courseData.status,
      prerequisiteId: courseData.prerequisites?.id?.toString(),
      validity: courseData.validity
        ? new Date(courseData.validity).toISOString().split("T")[0]
        : "",
      courseCover: courseData.cover,
      medicalTest: courseData.requiresMedicalTest ? "yes" : "no",
      maxAttendees: courseData.maxAttendees?.toString() ?? "",
      languageId: courseData.language?.id?.toString() ?? "",
      levelId: courseData.level?.id?.toString() ?? "",
      facilityId: courseData.facility?.id?.toString() ?? "",
      courseTypeId: courseData.courseType?.id?.toString() ?? "",
    };
  };

  const getInitialPricingValues = (
    pricingId: number
  ): Partial<PricingFormValues> => {
    const pricingItem = pricingData.find((item) => item.id === pricingId);
    if (!pricingItem) return {};

    return {
      price: Number(pricingItem.price),
      discount: Number(pricingItem.discount),
      isTheoreticalOnly: pricingItem.isTheoreticalOnly,
      type: pricingItem.type,
      isCompanyTraining: pricingItem.isCompanyTraining,
      countryId: Number(pricingItem.countryId)
    };
  };

  const getInitialCertificateValues = (
    certificateId: number
  ): Partial<CertificateFormValues> => {
    const certificateItem = certificateData.find(
      (item) => item.id === certificateId
    );
    if (!certificateItem) return {};

    // Map certificateItem properties to CertificateFormValues
    // Adjust property names as needed based on CertificateFormValues and certificateItem structure
    return {
      certificateName: certificateItem.title,
      validate_date_interval: [
        certificateItem.validFrom ? new Date(certificateItem.validFrom) : null,
        certificateItem.validTo ? new Date(certificateItem.validTo) : null,
      ],
      issue_date: certificateItem.issueDate
        ? new Date(certificateItem.issueDate).toISOString().split("T")[0]
        : "",
      displayScore: certificateItem.displaySource ? "yes" : "no",
      watermark: certificateItem.watermark ? "yes" : "no",
    };
  };

  const handleSave = async (values: FormikValues) => {
    setFormSubmitting(true);
    const result = await updateCourse(
      Number(courseID),
      values as Partial<CourseFormValues>
    );
    setFormSubmitting(false);
    if (result.success) {
      showToast.success(tMsgs("course_updated_successfully"));
      setIsEditing(false);
      refetchCourseData();
    } else {
      showToast.error(result.error || tMsgs("error_updating_course"));
    }
  };

  const handleSavePricing = async (values: FormikValues) => {
    if (!editingPricingId) return;

    setFormSubmitting(true);
    try {
      const result = await updateCoursePricing(
        Number(courseID),
        editingPricingId,
        values as Partial<PricingFormValues>
      );

      if (result.success) {
        showToast.success(tMsgs("pricing_updated_successfully"));
        setIsEditingPricing(false);
        setEditingPricingId(null);
        refetchPricingData();
      } else {
        showToast.error(result.error || tMsgs("error_updating_pricing"));
      }
    } catch (error) {
      showToast.error(tMsgs("error_updating_pricing"));
      console.error(error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleSaveCertificate = async (values: FormikValues) => {
    if (!editingCertificateId) return;

    setFormSubmitting(true);
    try {
      // Prepare data for the API call, adjust based on API requirements
      const apiData = {
        title: values.certificateName,
        validFrom: values.validate_date_interval?.[0]?.toISOString(),
        validTo: values.validate_date_interval?.[1]?.toISOString(),
        issueDate: values.issue_date
          ? new Date(values.issue_date).toISOString()
          : null,
        displaySource: values.displayScore,
        watermark: values.watermark,
      };
      console.log('apiData>>',apiData);
      console.log('VALUES>>',values);
      const result = await updateCertificate(
        editingCertificateId,
        apiData as unknown as Partial<CertificateFormValues>
      );
      if (result.success) {
        showToast.success(tMsgs("certificate_updated_successfully"));
        setIsEditingCertificate(false);
        setEditingCertificateId(null);
        refetchCertificateData();
      } else {
        showToast.error(result.error || tMsgs("error_updating_certificate"));
      }
    } catch (error) {
      showToast.error(tMsgs("error_updating_certificate"));
      console.error(error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCancelEditPricing = () => {
    setIsEditingPricing(false);
    setEditingPricingId(null);
  };

  const handleEditPricing = (pricingId: number) => {
    setEditingPricingId(pricingId);
    setIsEditingPricing(true);
  };

  const handleEditCertificate = (certificateId: number) => {
    setEditingCertificateId(certificateId);
    setIsEditingCertificate(true);
  };

  const handleCancelEditCertificate = () => {
    setIsEditingCertificate(false);
    setEditingCertificateId(null);
  };

  const handleSuspend = () => {
    console.log("Suspend action triggered...");
    showToast.info("Suspend functionality not implemented yet.");
  };

  const handleDelete = () => {
    console.log("Delete action triggered...");
    showToast.info("Delete functionality not implemented yet.");
  };

  if (initialLoading && !courseData) return <div>{t("loading")}...</div>;
  if (error) return <div>{error}</div>;
  if (!courseData) return <div>{t("no_course_data")}</div>;

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("courses"), href: "/dashboard/courses" },
    {
      label: t("course_details"),
      href: `/dashboard/courses/${courseID}`,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "course_info":
        return isEditing ? (
          <CourseInfoForm
            initialValues={getInitialFormValues()}
            onSubmit={handleSave}
            onCancel={handleCancelEdit}
            isLoading={formSubmitting}
          />
        ) : (
          <CourseInfoDisplay courseData={courseData} />
        );
      case "pricing":
        return isEditingPricing && editingPricingId ? (
          <PricingForm
            initialValues={getInitialPricingValues(editingPricingId)}
            onSubmit={handleSavePricing}
            onCancel={handleCancelEditPricing}
            isLoading={formSubmitting}
          />
        ) : (
          <PricingTabContent
            pricingData={pricingData}
            courseId={Number(courseID)}
            isLoading={tabLoading}
            onEditPricing={handleEditPricing}
            refetchPricingData={refetchPricingData}
          />
        );
      case "exam":
        return (
          <ExamTabContent
            courseId={Number(courseID)}
            examData={examData}
            isLoading={tabLoading}
            refetchExamData={refetchExamData}
          />
        );
      case "certificate":
        // Show CertificateForm when editing
        return isEditingCertificate && editingCertificateId ? (
          <CertificateForm
            initialValues={getInitialCertificateValues(editingCertificateId)}
            onSubmit={handleSaveCertificate}
            onCancel={handleCancelEditCertificate}
            isLoading={formSubmitting}
          />
        ) : (
          <CertificateTabContent
            certificateData={certificateData}
            isLoading={tabLoading}
            onEditCertificate={handleEditCertificate}
            courseId={Number(courseID)}
            refetchCertificateData={refetchCertificateData}
          />
        );
      case "sessions":
        return (
          <SessionsTabContent
            sessionData={sessionData}
            isLoading={tabLoading}
            refetchSessionData={refetchSessionData}
            courseId={Number(courseID)}
          />
        );
      case "enrollments":
        return (
          <EnrollmentsTabContent
            enrollmentsData={enrollmentsData}
            isLoading={tabLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("course_details")}
        actions={
          <CourseHeaderActions
            isEditing={isEditing}
            activeTab={activeTab}
            onEdit={() => setIsEditing(true)}
            onSuspend={handleSuspend}
            onDelete={handleDelete}
          />
        }
      />
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white">
        <CourseTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          disabled={isEditing || isEditingPricing}
        />
        <div className="p-4">{renderTabContent()}</div>
      </div>
    </div>
  );
}
