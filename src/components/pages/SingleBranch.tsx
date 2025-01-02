"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Status from "../ui/Status";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import LocationTick from "../ui/icons/LocationTick";
import Lock from "../ui/icons/Lock";
import Suspend from "../ui/icons/Suspend";
// import { Edit2 } from "../ui/icons/Edit2";

interface SingleBranchProps {
  branchID: string; // Define the type for branchID
}

export default function SingleBranch({ branchID }: SingleBranchProps) {
  const t = useTranslations("common");
  //   const [filtersOpen, setFiltersOpen] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);

  console.log("branchID", branchID);
  console.log("addPopupOpen", addPopupOpen);
  //   const handleExport = () => {
  //     console.log("Exporting data...");
  //   };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("company-management"), href: "/dashboard/company-management" },
    {
      label: t("branch_details"),
      href: "/dashboard/company-management/branches",
    },
  ];
  return (
    <div className="h-full">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("branch_details")}
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
        <h1 className="heading3">{t("branch_details")}</h1>
        <div className="flex items-center justify-between">
          <GroupInfo
            label={t("branch_name")}
            content={"branch sheraton"}
            copyIt
            icon={<Buildings2 />}
          />
          <GroupInfo
            label={t("address")}
            content={"42 Fairhaven Commons Way, Fairhaven MA 2719"}
            copyIt
            icon={<LocationTick />}
          />
          <GroupInfo
            label={t("pin_location")}
            content={
              <a href="https://maps.google.com?q=30.033333,31.233334" target="_blank" className="text-blue-400 underline">
                Go to Map
              </a>
            }
            icon={<LocationTick />}
          />
          <GroupInfo label={t("status")} content={<Status status={"1"} />} />
        </div>
      </div>
    </div>
  );
}
