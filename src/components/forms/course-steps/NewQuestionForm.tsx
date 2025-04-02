/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { submitExamQuestion, updateExamQuestion } from "@/api/courseService";
import Input from "@/components/formsUI/Input";
import SelectField from "@/components/formsUI/SelectField";
import Textarea from "@/components/formsUI/Textarea";
import Button from "@/components/ui/Button";
import RadioCheck from "@/components/ui/icons/RadioCheck";
import RadioUnCheck from "@/components/ui/icons/RadioUnCheck";
import { Trash } from "@/components/ui/icons/Trash";
import { Question } from "@/types/courses.types";
import { ErrorMessage, Form, Formik } from "formik";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";

interface Answer {
  text: string;
  isCorrect: boolean;
  matchWith?: string;
}

interface NewQuestionFormProps {
  title?: string;
  sub_title?: string;
  onClose?: () => void;
  examId?: string;
  editQuestion?: Question | null;
}
interface FormValues {
  title: string;
  description: string;
  type: string;
  answers: Answer[];
  examId: string;
  options: string[];
}

export default function NewQuestionForm({
  title,
  sub_title,
  onClose,
  examId,
  editQuestion
}: NewQuestionFormProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const tValidation = useTranslations("validation");
  const [answers, setAnswers] = useState<Answer[]>([
    { text: "", isCorrect: false },
  ]);

  const validationSchema = Yup.object({
    title: Yup.string().required(tValidation("required")),
    description: Yup.string().required(tValidation("required")),
  });
  
  const initialValues = {
    title: editQuestion?.title || "",
    description: editQuestion?.description || "",
    type: editQuestion?.type || "",
    answers: editQuestion?.options.map(opt => ({
      text: opt.optionText,
      isCorrect: opt.isCorrect,
      matchWith: "",
    })) || [{ text: "", isCorrect: false, matchWith: "" }],
    examId: "",
    options: [],
  };
  
  useEffect(() => {
    if (editQuestion) {
      setAnswers(
        editQuestion.options.map(opt => ({
          text: opt.optionText,
          isCorrect: opt.isCorrect,
        }))
      );
    }
  }, [editQuestion]);
  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    setSubmitting(true);
    try {
      if (!examId) {
        toast.error(tMsgs("missing_examId"));
        return;
      }
  
      const questionData = {
        title: values.title,
        description: values.description,
        type: values.type,
        examId: Number(examId),
        options: values.type === "MATCHING" ? [] : answers.map((answer) => ({
          optionText: answer.text,
          isCorrect: answer.isCorrect,
        })),
        answers: values.type === "MATCHING" ? answers.map((answer, index) => ({
          answerText: answer.text,
          isCorrect: true,
          matchWith: answers[(index + 1) % answers.length].text,
          options: answers.map((a) => a.text),
        })) : [],
      };
  
      const result = editQuestion
        ? await updateExamQuestion(examId, editQuestion.id, questionData)
        : await submitExamQuestion(examId, questionData);
  
      if (result.success) {
        toast.success(tMsgs(editQuestion ? "question_updated_successfully" : "question_created_successfully"));
        onClose?.();
      } else {
        toast.error(result.error || tMsgs(editQuestion ? "error_updating_question" : "error_creating_question"));
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(tMsgs(editQuestion ? "error_updating_question" : "error_creating_question"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { text: "", isCorrect: false }]);
  };

  const handleRemoveAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const handleAnswerChange = (index: number, text: string) => {
    const newAnswers = [...answers];
    newAnswers[index].text = text;
    setAnswers(newAnswers);
  };

  const handleCorrectAnswer = (index: number) => {
    const newAnswers = answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index,
    }));
    setAnswers(newAnswers);
  };

  return (
    <div className="p-6">
      <h2 className="heading3">{title}</h2>
      <p className="textRegular mt-1.5">{sub_title}</p>

      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          setFieldValue,
          handleChange,
          isSubmitting,
          handleSubmit,
        }) => (
          <Form className="mt-6 space-y-4">
            <div className="col-span-2">
              <SelectField
                label={t("question_type.name")}
                name="type"
                value={values.type}
                onChange={(name, value) => setFieldValue(name, value)}
                options={[
                  { value: "MCQ", label: t("question_type.mcq") },
                  // { value: "True_False", label: t("question_type.true_false") },
                  // { value: "MATCING", label: t("question_type.matching") },
                ]}
                customDropdown
              />
              <ErrorMessage
                name="type"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div>
              <Input
                label={t("question_title")}
                type="text"
                placeholder={t("enter_question_title")}
                value={values.title}
                onChange={handleChange}
                name="title"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div>
              <Textarea
                label={t("description")}
                placeholder="description"
                value={values.description}
                onChange={handleChange}
                name="description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-xs text-red-500 py-1"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("answers")}
              </label>
              <ul className="space-y-2">
                {answers.map((answer, index) => {
                  if (
                    index === 0 &&
                    !answers.some((a) => a.isCorrect) &&
                    values.type !== "MATCHING"
                  ) {
                    answer.isCorrect = true;
                  }

                  return (
                    <li
                      key={index}
                      className="flex items-center gap-2 rounded-lg border p-2"
                    >
                      <input
                        type="text"
                        value={answer.text}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                        placeholder={
                          values.type === "MATCHING"
                            ? t("enter_matching_item")
                            : t("enter_answer")
                        }
                        className="flex-1 border-none bg-transparent outline-none placeholder:text-dark"
                      />
                      {values.type !== "MATCHING" && (
                        <button
                          type="button"
                          onClick={() => handleCorrectAnswer(index)}
                          className="text-primary w-5"
                        >
                          {answer.isCorrect ? <RadioCheck /> : <RadioUnCheck />}
                        </button>
                      )}
                      {(index !== 0 || values.type === "MATCHING") && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAnswer(index)}
                          className="text-red-500 w-5"
                        >
                          <Trash />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
              <Button
                label={
                  values.type === "MATCHING"
                    ? t("buttons.add_matching_pair")
                    : t("buttons.add_answer")
                }
                onClick={handleAddAnswer}
                variant="dark"
                padding="py-2 px-3"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                label={t("buttons.cancel")}
                onClick={onClose}
                variant="transparent"
                padding="py-3 px-4"
                type="button"
              />
              <Button
                label={
                  isSubmitting ? t("buttons.submitting") : t("buttons.submit")
                }
                variant="primary"
                padding="py-3 px-4"
                onClick={handleSubmit}
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
