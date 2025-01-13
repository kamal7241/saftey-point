"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Status from "../ui/Status";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Suspend from "../ui/icons/Suspend";

import CalendarRemove from "../ui/icons/CalendarRemove";
import CalendarTick from "../ui/icons/CalendarTick";
import ClipboardTick from "../ui/icons/ClipboardTick";
import DocumentText from "../ui/icons/DocumentText";
import StatusCheck from "../ui/icons/StatusCheck";
import Image from "next/image";
// import { Edit2 } from "../ui/icons/Edit2";

interface SingleCertificateProps {
  certificateID: string; // Define the type for certificateID
}

export default function SingleCertificate({
  certificateID,
}: SingleCertificateProps) {
  const t = useTranslations("common");
  //   const [filtersOpen, setFiltersOpen] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);

  console.log("certificateID", certificateID);
  console.log("addPopupOpen", addPopupOpen);
  //   const handleExport = () => {
  //     console.log("Exporting data...");
  //   };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("user-management"), href: "/dashboard/user-management" },
    {
      label: t("view_certificates"),
      href: "/dashboard/certificate-management/certificates",
    },
  ];
  return (
    <div className="h-full">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("view_certificates")}
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
        <h1 className="heading3">{t("view_certificates")}</h1>

        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("certificate_id")}
              content={"44973"}
              icon={<DocumentText />}
            />
            <GroupInfo
              label={t("certificate_name")}
              content={"Certificate of Appreciation"}
              copyIt
              icon={<ClipboardTick />}
            />
            <GroupInfo
              label={t("status")}
              content={<Status status={"1"} />}
              icon={<StatusCheck />}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("issue_date")}
              content={"2024 / 12 / 11"}
              icon={<CalendarTick />}
            />
            <GroupInfo
              label={t("expiry_date")}
              content={"2026 / 12 / 11"}
              icon={<CalendarRemove />}
            />
          </div>
          <h3 className="heading3">{t("view_certificates")}</h3>
          <Image
            src="/images/cert-template.jpg"
            alt="cert-template"
            width={853}
            height={627}
            className="my-4"
          />
        </div>
      </div>
    </div>
  );
}
