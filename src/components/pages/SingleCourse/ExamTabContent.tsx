/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { FormikValues } from "formik";
import GroupInfo from "../../ui/GroupInfo";
import QuestionsTable from "../../forms/course-steps/QuestionsTable";
import Note from "../../ui/icons/Note";
import NoteFlat from "../../ui/icons/NoteFlat";
import Timer from "../../ui/icons/Timer";
import TaskBorder from "../../ui/icons/TaskBorder";
import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import { submitExam, updateExam } from "@/api/courseService";
import { showToast } from "@/utils/toast";
import ExamForm from "./ExamForm";

interface ExamTabContentProps {
  examData: any[];
  isLoading: boolean;
  courseId: number;
  refetchExamData: () => void;
}

export default function ExamTabContent({
  examData,
  isLoading,
  courseId,
  refetchExamData,
}: ExamTabContentProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [currentExam, setCurrentExam] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: FormikValues) => {
    try {
      setIsSubmitting(true);
      const result = await submitExam(values, courseId.toString());
      if (result.success) {
        setShowAddPopup(false);
        showToast.success(tMsgs("exam_added_successfully"));
        refetchExamData();
      } else {
        showToast.error(tMsgs("error_adding_exam"));
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditExam = async (values: FormikValues) => {
    try {
      setIsSubmitting(true);
      const result = await updateExam(currentExam?.id.toString() || "", {
        title: values.examName,
        examType: values.examType,
        instructions: values.instructions,
        duration: Number(values.examDuration),
        totalMarks: Number(values.totalMarks),
        passMarks: Number(values.passMarks),
        courseId: courseId,
      });
      if (result.success) {
        setShowEditPopup(false);
        showToast.success(tMsgs("exam_updated_successfully"));
        refetchExamData();
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

  if (isLoading) {
    return <div>{t("loading")}...</div>;
  }

  if (!examData || examData.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div>{t("no_exams_found")}</div>
        <Button
          type="button"
          label={t("buttons.add_exam")}
          onClick={() => setShowAddPopup(true)}
          variant="primary"
        />
        {showAddPopup && (
          <Popup isOpen={showAddPopup} onClose={() => setShowAddPopup(false)}>
            <ExamForm
              initialValues={{}}
              onSubmit={handleSubmit}
              onCancel={() => setShowAddPopup(false)}
              isLoading={isSubmitting}
            />
          </Popup>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y space-y-2">
      {examData.map((exam: any) => (
        <React.Fragment key={exam.id}>
          <div className="grid grid-cols-3 gap-6 py-4">
            <GroupInfo
              label={t("examName")}
              content={exam.title}
              icon={<Note />}
            />
            <GroupInfo
              label={t("examType")}
              content={exam.examType}
              icon={<NoteFlat />}
            />
            <GroupInfo
              label={t("examDuration")}
              content={`${exam.duration} ${t("mins")}`}
              icon={<Timer />}
            />
            <GroupInfo
              label={t("totalMarks")}
              content={`${exam.totalMarks}`}
              icon={<TaskBorder />}
            />
            <GroupInfo
              label={t("passMarks")}
              content={`${exam.passMarks}`}
              icon={<TaskBorder />}
            />
            <div className="col-span-3">
              <GroupInfo
                label={t("discription")}
                content={`${exam.instructions}`}
                icon={<TaskBorder />}
              />
            </div>
            <div className="flex gap-2 col-span-3">
              <Button
                type="button"
                label={t("buttons.edit")}
                onClick={() => {
                  setCurrentExam(exam);
                  setShowEditPopup(true);
                }}
                variant="secondary"
              />
            </div>
          </div>

          {showEditPopup && currentExam && (
            <Popup
              isOpen={showEditPopup}
              onClose={() => setShowEditPopup(false)}
            >
              <ExamForm
                initialValues={{
                  examName: currentExam.title,
                  examType: currentExam.examType,
                  examDuration: currentExam.duration,
                  totalMarks: currentExam.totalMarks,
                  passMarks: currentExam.passMarks,
                  instructions: currentExam.instructions,
                }}
                onSubmit={handleEditExam}
                onCancel={() => setShowEditPopup(false)}
                isLoading={isSubmitting}
              />
            </Popup>
          )}
          <QuestionsTable examId={exam.id.toString()} />
        </React.Fragment>
      ))}
    </div>
  );
}
