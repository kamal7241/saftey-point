"use client";
import { fetchCourseById } from "@/api/dashboardService";
import type { SingleCourse } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import { Delete } from "../ui/icons/Delete";
import { Edit } from "../ui/icons/Edit";
import Edit2 from "../ui/icons/Edit2";
import Suspend from "../ui/icons/Suspend";
import UserSquare from "../ui/icons/UserSquare";

interface SingleCourseProps {
  courseID: string;
}

export default function SingleCourse({ courseID }: SingleCourseProps) {
  const t = useTranslations("common");
  const [courseData, setCourseData] = useState<SingleCourse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  console.log("courseData", courseData);
  console.log("editPopupOpen", editPopupOpen);
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
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("instructor")}
              content="John Doe"
              icon={<UserSquare />}
            />
            <GroupInfo
              label={t("duration")}
              content="12 Weeks"
              icon={<Edit />}
            />
            <GroupInfo
              label={t("start_date")}
              content="March 1, 2025"
              icon={<Edit />}
            />
          </div>
        );
      case "pricing":
        return (
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo label={t("price")} content="$499" icon={<Edit />} />
            <GroupInfo
              label={t("discount")}
              content="10% Off"
              icon={<Edit />}
            />
            <GroupInfo
              label={t("payment_methods")}
              content="Credit Card, PayPal"
              icon={<Edit />}
            />
          </div>
        );
      case "exam":
        return (
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("examType")}
              content="Final Exam"
              icon={<Edit />}
            />
            <GroupInfo
              label={t("examDuration")}
              content="3 Hours"
              icon={<Edit />}
            />
            <GroupInfo
              label={t("passing_score")}
              content="80%"
              icon={<Edit />}
            />
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
              onClick={() => setEditPopupOpen(true)}
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
              onClick={() => setEditPopupOpen(true)}
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
