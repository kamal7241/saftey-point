"use client";
import { submitExamQuestion } from "@/api/courseService";
import Input from "@/components/formsUI/Input";
import SelectField from "@/components/formsUI/SelectField";
import Textarea from "@/components/formsUI/Textarea";
import { ErrorMessage, FormikProps, FormikValues } from "formik";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import QuestionsTable from "./QuestionsTable";

interface ExamProps {
  values: FormikValues;
  handleChange: FormikProps<FormikValues>["handleChange"];
  setFieldValue: FormikProps<FormikValues>["setFieldValue"];
  errors: FormikValues;
  examId?: string;
}

export default function Exam({
  values,
  handleChange,
  errors,
  setFieldValue,
  examId,
}: ExamProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");

  const handleAddQuestion = async () => {
    const questionData = {
      title: "Sample Question",
      description: "Sample Description",
      type: "MCQ",
      examId: Number(examId),
      options: [
        {
          optionText: "Option A",
          isCorrect: false,
        },
      ],
      answers: [
        {
          answerText: "Correct answer",
          isCorrect: true,
          matchWith: "Match A",
          options: ["Option 1", "Option 2"],
        },
      ],
    };

    if (examId) {
      const result = await submitExamQuestion(examId, questionData);
      if (result.success) {
        toast.success(tMsgs("question_created_successfully"));
      } else {
        toast.error(result.error || tMsgs("error_creating_question"));
      }
    }
  };

  return (
    <div>
      <div className="mt-4 grid w-full grid-cols-4 gap-x-4 gap-y-6">
        <div className="col-span-4">
          <Input
            label={t("examName")}
            type="text"
            placeholder={t("examName")}
            value={values.examName}
            onChange={handleChange}
            name="examName"
          />
          <ErrorMessage
            name="examName"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>
        <div className="col-span-2">
          <SelectField
            label={t("examType")}
            name="examType"
            value={values.examType}
            onChange={(name, value) => setFieldValue(name, value)}
            options={[
              { value: "WRITTEN", label: t("exam_type.written") },
              { value: "PRACTICAL", label: t("exam_type.practical") },
              { value: "ONLINE", label: t("exam_type.online") },
            ]}
            customDropdown
          />
          {errors.examType && (
            <p className="text-xs text-red-500 py-1">{errors.examType}</p>
          )}
        </div>
        <div className="col-span-2">
          <Input
            label={t("examDuration")}
            type="number"
            placeholder={t("examDuration")}
            value={values.examDuration}
            onChange={handleChange}
            name="examDuration"
          />
          <ErrorMessage
            name="examDuration"
            component="div"
            className="text-xs text-red-500"
          />
        </div>
        <div className="col-span-2">
          <Input
            label={t("totalMarks")}
            type="text"
            placeholder={t("totalMarks")}
            value={values.totalMarks}
            onChange={handleChange}
            name="totalMarks"
          />
          <ErrorMessage
            name="totalMarks"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>
        <div className="col-span-2">
          <Input
            label={t("passMarks")}
            type="text"
            placeholder={t("passMarks")}
            value={values.passMarks}
            onChange={handleChange}
            name="passMarks"
          />
          <ErrorMessage
            name="passMarks"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>
        <div className="col-span-4">
          <Textarea
            label={t("instructions")}
            placeholder="instructions"
            value={values.instructions}
            onChange={handleChange}
            name="instructions"
          />
          <ErrorMessage
            name="instructions"
            component="div"
            className="text-xs text-red-500 py-1"
          />
        </div>
      </div>
      <QuestionsTable examId={examId} />
      {examId && (
        <>
          <div className="col-span-4 mt-4">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              {t("buttons.add_question")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
