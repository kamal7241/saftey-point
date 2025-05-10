"use client";
import { deleteBranch, fetchBranchById, toggleBranchVerification } from "@/api/companiesService";
import { useRouter } from "@/i18n/routing";
import { Branch } from "@/types/ui.types";
import { showToast } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useState } from "react";
import NewBranchForm from "../forms/NewBranchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Popup from "../ui/Popup";
import Status from "../ui/Status";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import LocationTick from "../ui/icons/LocationTick";
import Suspend from "../ui/icons/Suspend";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const handleClose = async () => {
    setAddPopupOpen(false);
    try {
      const newData = await fetchBranchById(branchID);
      setMainData(newData);
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  };
  const handleDelete = async () => {
    const result = await deleteBranch(Number(branchID));
    if (result.success) {
      router.push("/dashboard/company-management/branches");
    } else {
      setError(result.error || "Failed to delete branch.");
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };


  const handleToggleVerification = async () => {
    try {
      const result = await toggleBranchVerification(Number(branchData?.id),
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
      <Popup isOpen={addPopupOpen} onClose={handleClose}>
        <NewBranchForm
          title={t("edit_branch")}
          sub_title={t("form_subtitle")}
          onClose={handleClose}
          branchData={branchData}
        />
      </Popup>
      <Popup isOpen={showDeleteConfirm} onClose={handleDeleteCancel}>
        <div>
          <p className="p-5 text-center text-2xl">
            {t("are_you_sure_delete")}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={handleDelete} label={t("buttons.confirm")} />
            <Button
              onClick={handleDeleteCancel}
              label={t("buttons.cancel")}
              variant="dark"
            />
          </div>
        </div>
      </Popup>
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
              label={t((mainData.status === "ACTIVE" || mainData.status == 1) ? "buttons.suspend" : "buttons.activate")}
              onClick={() => setShowSuspendConfirm(true)}
              icon={
                <span className={`inline-block w-6 ${(mainData.status === "ACTIVE" || mainData.status == 1) ? "" : "rotate-180"}`}>
                  <Suspend />
                </span>
              }
              variant={(mainData.status === "ACTIVE" || mainData.status == 1) ? "dark" : "success"}
            />
            <Button
              label={t("buttons.delete")}
              onClick={() => setShowDeleteConfirm(true)}
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
          <GroupInfo label={t("status")} content={<Status status={mainData.status.toString()} />} block />
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
