"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Lock from "../ui/icons/Lock";
import Suspend from "../ui/icons/Suspend";

interface SingleExamProps {
  examID: string;
}

export default function SingleExam({ examID }: SingleExamProps) {
  const t = useTranslations("common");

  const [addPopupOpen, setAddPopupOpen] = useState(false);

  console.log("examID", examID);
  console.log("addPopupOpen", addPopupOpen);

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("exam-management"), href: "/dashboard/exam-management" },
    {
      label: t("exam_details"),
      href: "/dashboard/exam-management/exams",
    },
  ];
  return (
    <div className="h-full">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("exam_details")}
        actions={
          <>
            <Button
              label={t("buttons.edit")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
                  <Edit2 />
                </span>
              }
              variant="primary"
            />
            <Button
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
            />
          </>
        }
      />
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
        <h1 className="heading3">{t("exam_details")}</h1>
        <div className="flex items-center gap-3 rounded-lg border border-gray-900 border-opacity-50 p-4">
          <h2 className="heading2">{`Steven O'Reilly`}</h2>
        </div>
      </div>
    </div>
  );
}
