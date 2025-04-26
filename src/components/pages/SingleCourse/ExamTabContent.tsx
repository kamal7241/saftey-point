import React from "react";
import { useTranslations } from "next-intl";
import GroupInfo from "../../ui/GroupInfo";
import QuestionsTable from "../../forms/course-steps/QuestionsTable"; // Assuming this path is correct
import Note from "../../ui/icons/Note";
import NoteFlat from "../../ui/icons/NoteFlat";
import Timer from "../../ui/icons/Timer";
import TaskBorder from "../../ui/icons/TaskBorder";

// Define a type for the exam data item, adjust based on your actual API response
interface ExamItem {
  id: number;
  title: string;
  examType: string; // e.g., 'Written', 'Practical'
  duration: number; // in minutes
  totalMarks: number;
  passMarks: number;
  // Add other relevant fields
}

interface ExamTabContentProps {
  examData: ExamItem[];
  isLoading: boolean;
}

export default function ExamTabContent({ examData, isLoading }: ExamTabContentProps) {
  const t = useTranslations("common");

  if (isLoading) {
    return <div>{t("loading")}...</div>;
  }

  if (!examData || examData.length === 0) {
    return <div>{t("no_exams_found")}</div>; // Or a more specific message
  }

  return (
    <div className="divide-y space-y-2">
      {examData.map((exam) => (
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
            {/* Add other exam details as needed */}
          </div>
          {/* Assuming QuestionsTable takes examId */}
          <QuestionsTable examId={exam.id.toString()} />
        </React.Fragment>
      ))}
    </div>
  );
}