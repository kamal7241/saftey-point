"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Status from "../ui/Status";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Lock from "../ui/icons/Lock";
import PhoneIcon from "../ui/icons/PhoneIcon";
import Suspend from "../ui/icons/Suspend";
// import { Edit2 } from "../ui/icons/Edit2";

interface SingleCompanyProps {
  companyID: string; // Define the type for companyID
}

export default function SingleCompany({ companyID }: SingleCompanyProps) {
  const t = useTranslations("common");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);

  console.log("companyID", companyID);
  const handleExport = () => {
    console.log("Exporting data...");
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("company-management"), href: "/dashboard/company-management" },
    {
      label: t("manage-companies"),
      href: "/dashboard/company-management/manage-companies",
    },
  ];
  return (
    <div className="h-full">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("company_details")}
        actions={
          <>
            <Button
              label={t("buttons.edit")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="w-6 inline-block">
                  <Edit2 />
                </span>
              }
              variant="primary"
            />
            <Button
              label={t("buttons.reset_password")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="w-6 inline-block">
                  <Lock />
                </span>
              }
              variant="secondary"
            />
            <Button
              label={t("buttons.suspend")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="w-6 inline-block">
                  <Suspend />
                </span>
              }
              variant="dark"
            />
            <Button
              label={t("buttons.delete")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="w-6 inline-block">
                  <Delete />
                </span>
              }
              variant="danger"
            />
          </>
        }
      />
      <div className="p-4 flex gap-4 flex-col bg-white rounded-2xl mt-6">
        <h1 className="heading3">{t("company_details")}</h1>
        <div className="border border-gray-900 p-4 flex gap-3 items-center border-opacity-50 rounded-lg">
          <Image
            src="/images/company-profile.png"
            alt="company-profile"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h2 className="heading2">Abernathy - Stoltenberg</h2>
        </div>
        <div className="flex justify-between items-center">
          <GroupInfo
            label={t("phone_number")}
            content={"0122939383383"}
            copyIt
            icon={<PhoneIcon />}
          />
          <GroupInfo
            label={t("company_email")}
            content={"bill.sanders@example.com"}
            copyIt
            icon={<Buildings2 />}
          />
          <GroupInfo label={t("status")} content={<Status status={"1"} />} />
        </div>
      </div>
    </div>
  );
}
