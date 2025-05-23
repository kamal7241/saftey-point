"use client";
import { useTranslations } from "next-intl";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import DocumentText from "../ui/icons/DocumentText";
import Edit2 from "../ui/icons/Edit2";
import { useState } from "react";
import Popup from "../ui/Popup";
import ExamForm from "./SingleCourse/ExamForm";
import { FormikValues } from "formik";
import { updateExam } from "@/api/courseService";
import { showToast } from "@/utils/toast";

interface SingleExamProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  examData: any;
  examID: string;
}

export default function SingleExam({ examID, examData }: SingleExamProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [addPopupOpen, setAddPopupOpen] = useState(false);

  console.log("examID", examID);


  const handleClose = async () => {
    setShowEditPopup(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  const handleEditExam = async (values: FormikValues) => {
    try {
      setIsSubmitting(true);
      const result = await updateExam(examID.toString() || "", {
        title: values.examName,
        examType: values.examType,
        instructions: values.instructions,
        duration: Number(values.examDuration),
        totalMarks: Number(values.totalMarks),
        passMarks: Number(values.passMarks),
        courseId: examData.courseId,
      });
      if (result.success) {
        showToast.success(tMsgs("exam_updated_successfully"));
        handleClose();
      } else {
        showToast.error(tMsgs("error_updating_exam"));
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating exam:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("exam-management"), href: "/dashboard/user-management/exams" },
    {
      label: t("exam_details"),
      href: "/dashboard/exam-management/exams",
    },
  ];
  return (
    <div className="h-full">

      {showEditPopup && (
        <Popup isOpen={showEditPopup} onClose={() => handleClose()}>
          <ExamForm
            initialValues={{
              examName: examData.title,
              examType: examData.examType,
              examDuration: examData.duration,
              totalMarks: examData.totalMarks,
              passMarks: examData.passMarks,
              instructions: examData.instructions,
            }}
            onSubmit={handleEditExam}
            onCancel={() => handleClose()}
            isLoading={isSubmitting}
          />
        </Popup>
      )}
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("exam_details")}
        actions={
          <>
            <Button
              label={t("buttons.edit")}
              icon={
                <span className="inline-block w-6">
                  <Edit2 />
                </span>
              }
              variant="primary"
              onClick={() => {
                setShowEditPopup(true);
              }}
            />
            {/* <Button
              label={t("buttons.reset_password")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
                  <Lock />
                </span>
              }
              variant="secondary"
            />
            <Button
              label={t("buttons.suspend")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
                  <Suspend />
                </span>
              }
              variant="dark"
            />
            <Button
              label={t("buttons.delete")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
                  <Delete />
                </span>
              }
              variant="danger"
            /> */}
          </>
        }
      />
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
        <h1 className="heading3">{t("exam_details")}</h1>
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("examName")}
              content={examData.title}
              icon={<DocumentText />}
            />
            <GroupInfo
              label={t("instructions")}
              content={examData.instructions}
              icon={<DocumentText />}
            />
            <GroupInfo
              label={t("examDuration")}
              content={examData.duration}
              icon={<DocumentText />}
            />
            <GroupInfo
              label={t("examType")}
              content={examData.examType}
              icon={<DocumentText />}
            />
            <GroupInfo
              label={t("passMarks")}
              content={examData.passMarks}
              icon={<DocumentText />}
            />
            <GroupInfo
              label={t("totalMarks")}
              content={examData.totalMarks}
              icon={<DocumentText />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
