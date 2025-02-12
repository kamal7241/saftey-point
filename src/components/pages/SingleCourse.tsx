"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Status from "../ui/Status";
// import BookIcon from "../ui/icons/BookIcon";
// import { Delete } from "../ui/icons/Delete";
// import Edit2 from "../ui/icons/Edit2";
// import Calendar from "../ui/icons/Calendar";
// import Clock from "../ui/icons/Clock";
import MedalStar from "../ui/icons/MedalStar";
import UserSquare from "../ui/icons/UserSquare";
import AttachCircle from "../ui/icons/AttachCircle";
import StatusCheck from "../ui/icons/StatusCheck";
import { Edit } from "../ui/icons/Edit";

interface SingleCourseProps {
  courseID: string;
}

export default function SingleCourse({ courseID }: SingleCourseProps) {
  const t = useTranslations("common");
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  console.log("courseID", courseID);
  console.log("editPopupOpen", editPopupOpen);

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("courses"), href: "/dashboard/courses" },
    {
      label: t("course_details"),
      href: `/dashboard/courses/${courseID}`,
    },
  ];
  
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
              // icon={<Edit2 className="inline-block w-6" />}
              variant="primary"
            />
            <Button
              label={t("buttons.delete")}
              onClick={() => setEditPopupOpen(true)}
              // icon={<Delete className="inline-block w-6" />}
              variant="danger"
            />
          </>
        }
      />
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
        <h1 className="heading3">{t("course_details")}</h1>
        <div className="flex items-center gap-3 rounded-lg border border-gray-900 border-opacity-50 p-4">
          <Image
            src="/images/course-thumbnail.png"
            alt="course-thumbnail"
            width={80}
            height={80}
            className="rounded-lg"
          />
          <h2 className="heading2">Advanced Web Development</h2>
        </div>
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo label={t("instructor")} content="John Doe" icon={<UserSquare />} />
            <GroupInfo label={t("duration")} content="12 Weeks" icon={<Edit />} />
            <GroupInfo label={t("start_date")} content="March 1, 2025" icon={<Edit />} />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo label={t("category")} content={t("category.web_development")} icon={<Edit />} />
            <GroupInfo label={t("level")} content={t("level.advanced")} icon={<MedalStar />} />
            <GroupInfo label={t("status")} content={<Status status="1" />} icon={<StatusCheck />} />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo label={t("syllabus")} content="Syllabus.pdf" copyIt icon={<AttachCircle />} />
            <GroupInfo label={t("resources")} content="Resources.zip" copyIt icon={<AttachCircle />} />
          </div>
        </div>
      </div>
    </div>
  );
}
