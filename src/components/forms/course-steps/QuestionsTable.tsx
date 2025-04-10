"use client";
import { deleteExamQuestion, fetchExamQuestions } from "@/api/courseService";
import Button from "@/components/ui/Button";
import { Add } from "@/components/ui/icons/Add";
import { Delete } from "@/components/ui/icons/Delete";
import { Edit } from "@/components/ui/icons/Edit";
import Popup from "@/components/ui/Popup";
import { Question } from "@/types/courses.types";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import NewQuestionForm from "./NewQuestionForm";
import { showToast } from "@/utils/toast";

interface QuestionsTableProps {
  examId?: string;
}

export default function QuestionsTable({ examId }: QuestionsTableProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleEditClick = (question: Question) => {
    setEditingQuestion(question);
    setAddPopupOpen(true);
  };

  const getQuestions = useCallback(async () => {
    if (!examId) return;
    setLoading(true);
    const data = await fetchExamQuestions(examId);
    if (data) {
      setQuestions(data);
    } else {
      showToast.error(tMsgs("error_fetching_questions"));
    }
    setLoading(false);
  }, [examId, tMsgs]);

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  const handleAddQuestionClick = () => {
    if (!examId) {
      showToast.error(tMsgs("missing_examId"));
      return;
    }
    setAddPopupOpen(true);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!examId) return;

    try {
      const result = await deleteExamQuestion(examId, questionId);
      if (result.success) {
        showToast.success(t("question_deleted_successfully"));
        getQuestions();
      } else {
        showToast.error(t("error_deleting_question"));
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      showToast.error(t("error_deleting_question"));
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="heading2">{t("questions")}</h3>
        <div className="flex gap-3">
          <Button
            label={t("buttons.add_question")}
            onClick={handleAddQuestionClick}
            icon={
              <span className="inline-block w-6">
                <Add />
              </span>
            }
            variant="primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                  {t("loading")}...
                </td>
              </tr>
            ) : questions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                  {t("no_questions_found")}
                </td>
              </tr>
            ) : (
              questions.map((question) => (
                <tr
                  key={question.id}
                  className={`hover:bg-gray-50 ${questions.indexOf(question) % 2 === 0 ? "bg-gray-100" : ""
                    }`}
                >
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {question.title}
                  </td>
                  {/* <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {question.description}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {question.type}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    <ul>
                      {question.options.map((option, index) => (
                        <li key={index}>
                          {option.optionText} -{" "}
                          {option.isCorrect ? (
                            <span className="text-green-500">
                              {t("correct")}
                            </span>
                          ) : (
                            <span className="text-red-500">
                              {t("incorrect")}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td> */}
                  <td className="py-3 px-4 border-b text-sm text-gray-700 w-[135px]">
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => handleEditClick(question)}
                        aria-label={t("edit")}
                        type="button"
                      >
                        <span className="inline-block h-5 w-5 text-gray-900">
                          <Edit />
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        aria-label={t("trash")}
                        type="button"
                      >
                        <span className="inline-block h-5 w-5 text-red-400">
                          <Delete />
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Popup isOpen={addPopupOpen}
        onClose={() => {
          setAddPopupOpen(false);
          setEditingQuestion(null);
          getQuestions();
        }}>
        <NewQuestionForm
          title={
            editingQuestion
              ? t("buttons.edit_question")
              : t("buttons.add_question")
          }
          sub_title={t("form_subtitle")}
          onClose={() => {
            setAddPopupOpen(false);
            setEditingQuestion(null);
            getQuestions();
          }}
          examId={examId}
          editQuestion={editingQuestion}
        />
      </Popup>
    </div>
  );
}
