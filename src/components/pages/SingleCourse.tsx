"use client";
import {
  fetchCourseById,
  fetchCourseExams,
  fetchCoursePricing,
} from "@/api/courseService";
import type { SingleCourse } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import CorporatePricingTable from "../ui/CorporatePricingTable";
import GroupInfo from "../ui/GroupInfo";
import Attach from "../ui/icons/Attach";
import Calendar from "../ui/icons/Calendar";
import CourseTitle from "../ui/icons/CourseTitle";
import { Delete } from "../ui/icons/Delete";
import { Edit } from "../ui/icons/Edit";
import Edit2 from "../ui/icons/Edit2";
import LanguageSquare from "../ui/icons/LanguageSquare";
import Medical from "../ui/icons/Medical";
import Note from "../ui/icons/Note";
import NoteFlat from "../ui/icons/NoteFlat";
import People from "../ui/icons/People";
import StatusCheck from "../ui/icons/StatusCheck";
import Suspend from "../ui/icons/Suspend";
import Task from "../ui/icons/Task";
import TaskBorder from "../ui/icons/TaskBorder";
import Timer from "../ui/icons/Timer";
import ImagePopup from "../ui/ImagePopup";
import Status from "../ui/Status";
import QuestionsTable from "../forms/course-steps/QuestionsTable";

interface SingleCourseProps {
  courseID: string;
}

export default function SingleCourse({ courseID }: SingleCourseProps) {
  const t = useTranslations("common");
  const [courseData, setCourseData] = useState<SingleCourse>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pricingData, setPricingData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [examData, setExamData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "course_info" | "pricing" | "exam" | "certificate" | "sessions"
  >("course_info");

  const getCourseData = useCallback(async () => {
    setLoading(true);
    const data = await fetchCourseById(Number(courseID));
    if (data) {
      setCourseData(data);
      setLoading(false);
    } else {
      setError("Failed to fetch Course data.");
      setLoading(false);
    }
  }, [courseID]);

  useEffect(() => {
    getCourseData();
  }, [getCourseData]);

  useEffect(() => {
    const getPricingData = async () => {
      if (activeTab === "pricing") {
        const data = await fetchCoursePricing(Number(courseID));
        if (data) {
          setPricingData(data);
        }
      }
    };
    getPricingData();
  }, [activeTab, courseID]);

  useEffect(() => {
    const getExamData = async () => {
      if (activeTab === "exam") {
        const data = await fetchCourseExams(Number(courseID));
        if (data) {
          setExamData(data);
        }
      }
    };
    getExamData();
  }, [activeTab, courseID]);

  if (loading) return <div>Loading...</div>;
  if (error || !courseData) return <div>{error}</div>;
  // console.log("courseData", courseData);
  // console.log("editPopupOpen", editPopupOpen);
  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("courses"), href: "/dashboard/courses" },
    {
      label: t("course_details"),
      href: `/dashboard/courses/${courseID}`,
    },
  ];
  const handleSuspend = () => {
    console.log("Exporting data...");
  };
  const renderContent = () => {
    switch (activeTab) {
      case "course_info":
        return (
          <>
            <div className="grid grid-cols-3 gap-6">
              <GroupInfo
                label={t("courseTitle")}
                content={courseData.title ?? "missing from API"}
                icon={<CourseTitle />}
              />
              <GroupInfo
                label={t("status")}
                content={
                  courseData?.status === "ACTIVE" ? (
                    <Status status={"1"} />
                  ) : (
                    <Status status={"0"} />
                  )
                }
                icon={<StatusCheck />}
              />
              <GroupInfo
                label={t("prerequisites.name")}
                content={courseData.prerequisites ?? "missing from API"}
                icon={<CourseTitle />}
              />
              <GroupInfo
                label={t("validity")}
                content={
                  courseData.validity
                    ? new Date(courseData.validity).toDateString()
                    : "missing from API"
                }
                icon={<Calendar />}
              />
              <GroupInfo
                label={t("level.name")}
                content={courseData.level ?? "missing from API"}
                icon={<Task />}
              />
              <GroupInfo
                label={t("courseCover")}
                content={<ImagePopup imagePath={courseData?.cover} />}
                icon={<Attach />}
              />
              <GroupInfo
                label={t("language.name")}
                content={courseData.language ?? "missing from API"}
                icon={<LanguageSquare />}
              />
              <GroupInfo
                label={t("maxAttendees")}
                content={courseData.maxAttendees ?? "missing from API"}
                icon={
                  <span className="text-transparent">
                    <People />
                  </span>
                }
              />
              <GroupInfo
                label={t("medicalTest")}
                content={courseData.requiresMedicalTest ? "Yes" : "No"}
                icon={<Medical />}
              />
            </div>
            <div className="mt-6">
              <GroupInfo
                label={t("description")}
                content={courseData.description ?? "missing from API"}
                icon={<Note />}
              />
            </div>
          </>
        );
      case "pricing":
        return (
          // TODO add missing parameters
          <div className="divide-y space-y-2">
            {pricingData.map((pricing) => (
              <div key={pricing.id} className="grid grid-cols-3 gap-6 py-4">
                <GroupInfo
                  label={t("price")}
                  content={`$${pricing.price}`}
                  icon={<Edit />}
                />
                <GroupInfo
                  label={t("discount")}
                  content={`${pricing.discount}%`}
                  icon={<Edit />}
                />
                <GroupInfo
                  label={t("type")}
                  content={pricing.type}
                  icon={<Edit />}
                />
              </div>
            ))}
            <CorporatePricingTable courseId={courseID} />
          </div>
        );
      case "exam":
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
                    content={`${exam.duration} Mins`}
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
                </div>
                <QuestionsTable examId={exam.id} />
              </React.Fragment>
            ))}
          </div>
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
          <>
            <Button
              label={t("buttons.edit")}
              onClick={() => console.log("EDIT")}
              icon={
                <span className="inline-block w-6">
                  <Edit2 />
                </span>
              }
              variant="primary"
            />
            <Button
              label={t("buttons.suspend")}
              onClick={handleSuspend}
              icon={
                <span className="inline-block w-6">
                  <Suspend />
                </span>
              }
              variant="dark"
            />
            <Button
              label={t("buttons.delete")}
              onClick={() => console.log("EDIT")}
              icon={
                <span className="inline-block w-6">
                  <Delete />
                </span>
              }
              variant="danger"
            />
          </>
        }
      />
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white">
        <div className="flex gap-4 border-b border-gray-900 border-opacity-15 px-4">
          {["course_info", "pricing", "certificate", "exam", "sessions"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(
                    tab as
                      | "course_info"
                      | "pricing"
                      | "exam"
                      | "certificate"
                      | "sessions"
                  )
                }
                className={`px-4 py-3 text-lg font-medium capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-primary text-primary"
                    : "text-dark"
                }`}
              >
                {t(`tab.${tab}`)}
              </button>
            )
          )}
        </div>
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
}
