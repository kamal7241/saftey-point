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
import { Branch } from "@/types/ui.types";
import { fetchBranchById, toggleBranchVerification } from "@/api/companiesService";
import { showToast } from "@/utils/toast";
import Popup from "../ui/Popup";
// import { Edit2 } from "../ui/icons/Edit2";

interface SingleBranchProps {
  branchID: string;
  branchData: Branch;
}

export default function SingleBranch({ branchID, branchData }: SingleBranchProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [mainData, setMainData] = useState<Branch>(branchData);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log("branchID", branchID);
  console.log("addPopupOpen", addPopupOpen);
  //   const handleExport = () => {
  //     console.log("Exporting data...");
  //   };


  const handleToggleVerification = async () => {
    try {
      const result = await toggleBranchVerification(Number(branchData?.id),
        // branchData?.status.toString()
        (mainData.status === "ACTIVE" || mainData.status == 1) ? "INACTIVE" : "ACTIVE",
      );
      if (result.success) {
        const newData = await fetchBranchById(branchID);
        setMainData(newData);
        showToast.success(tMsgs(
          (mainData?.status === "ACTIVE" || mainData.status == 1)
            ? "branch_suspended_successfully"
            : "branch_activated_successfully"
        ));
      } else {
        setError(result.error || "Failed to update company status");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
    setShowSuspendConfirm(false);
  };

  const handleSuspendCancel = () => {
    setShowSuspendConfirm(false);
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("company-management"), href: "/dashboard/company-management" },
    {
      label: t("branch_details"),
      href: "/dashboard/company-management/branches",
    },
  ];
  if (error) return <div>{error}</div>;
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
              // label={t("buttons.suspend")}
              label={t((mainData.status === "ACTIVE" || mainData.status == 1) ? "buttons.suspend" : "buttons.activate")}
              onClick={() => setShowSuspendConfirm(true)}
              icon={
                <span className={`inline-block w-6 ${(mainData.status === "ACTIVE" || mainData.status == 1) ? "" : "rotate-180"}`}>
                  <Suspend />
                </span>
              }
              // variant="dark"
              variant={(mainData.status === "ACTIVE" || mainData.status == 1) ? "dark" : "success"}
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
        <div className="flex items-center justify-between gap-8 flex-wrap">
          <GroupInfo
            label={t("branch_name")}
            content={mainData.name}
            copyIt
            icon={<Buildings2 />}
          />
          <GroupInfo
            label={t("address")}
            content={mainData.address}
            copyIt
            icon={<LocationTick />}
          />
          <GroupInfo
            label={t("pin_location")}
            content={
              <a href={`https://maps.google.com?q=${mainData.latitude},${mainData.longitude}`} target="_blank" className="text-blue-400 underline">
                Go to Map
              </a>
            }
            icon={<LocationTick />}
          />
          <GroupInfo label={t("status")} content={<Status status={mainData.status === "ACTIVE" ? "1" : "0"} />} block />
        </div>
      </div>

      {showSuspendConfirm && (
        <Popup isOpen={showSuspendConfirm} onClose={handleSuspendCancel}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t(mainData.status === "INACTIVE" || mainData.status == 2 ? "are_you_sure_activate" : "are_you_sure_suspend")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleToggleVerification} label={t("buttons.confirm")} />
              <Button
                onClick={handleSuspendCancel}
                label={t("buttons.cancel")}
                variant="dark"
              />
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
