"use client";
import type { SingleCompany } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import ImageWithFallback from "../ui/ImageWithFallback";
import Status from "../ui/Status";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Lock from "../ui/icons/Lock";
import PhoneIcon from "../ui/icons/PhoneIcon";
import Suspend from "../ui/icons/Suspend";
import StatusCheck from "../ui/icons/StatusCheck";
import { useRouter } from "@/i18n/routing";
import { deleteCompany, resetCompanyPassword, toggleCompanyVerification } from "@/api/companiesService";
import Popup from "../ui/Popup";
import NewCompanyForm from "../forms/NewCompanyForm";
import ResetPasswordForm from "../forms/ResetPasswordForm";
import { fetchComapnyById } from "@/api/companiesService";
import { showToast } from "@/utils/toast";
import SomethingWentWrong from "../ui/SomethingWentWrong";

interface SingleCompanyProps {
  companyData: SingleCompany;
  companyID: string;
}

export default function SingleCompany({ companyData, companyID }: SingleCompanyProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [userData, setUserData] = useState<SingleCompany>(companyData);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [resetPasswordPopupOpen, setResetPasswordPopupOpen] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const router = useRouter();

  const handleClose = async () => {
    setAddPopupOpen(false);
    try {
      const newData = await fetchComapnyById(companyID);
      setUserData(newData);
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  };
  const handleDelete = async () => {
    const result = await deleteCompany(Number(userData?.id));
    if (result.success) {
      router.push("/dashboard/company-management/companies");
    } else {
      setError(result.error || "Failed to delete staff.");
    }
    setShowDeleteConfirm(false);
  };
  const handleResetPassword = async (newPassword: string) => {
    try {
      const result = await resetCompanyPassword(
        Number(userData?.id),
        newPassword
      );

      if (result.success) {
        setResetPasswordSuccess(true);
        setTimeout(() => {
          setResetPasswordPopupOpen(false);
          setResetPasswordSuccess(false);
        }, 2000);
      } else {
        setError(result.error || "Failed to reset password.");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleToggleVerification = async () => {
    try {
      const result = await toggleCompanyVerification(
        Number(userData?.id),
        // userData?.status
        (userData?.status === "ACTIVE") ? "INACTIVE" : "ACTIVE"
      );
      if (result.success) {
        const newData = await fetchComapnyById(companyID);
        setUserData(newData);
        showToast.success(tMsgs(
          userData?.user.isVerified
            ? "company_suspended_successfully"
            : "company_activated_successfully"
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
    { label: t("company-management"), href: "/dashboard/company-management/companies" },
    {
      label: t("manage-companies"),
      href: "/dashboard/company-management/manage-companies",
    },
  ];

  if (!userData || error) return <SomethingWentWrong />;
  return (
    <div className="h-full">
      <Popup isOpen={addPopupOpen} onClose={handleClose}>
        <NewCompanyForm
          title={t("edit_company")}
          sub_title={t("form_subtitle")}
          onClose={handleClose}
          companyData={userData}
        />
      </Popup>
      <Popup
        isOpen={resetPasswordPopupOpen}
        onClose={() => setResetPasswordPopupOpen(false)}
      >
        {resetPasswordSuccess ? (
          <div className="p-4 text-center">
            <p className="text-green-500 text-lg font-semibold">
              {t("password_reset_success")}
            </p>
          </div>
        ) : (
          <ResetPasswordForm
            onClose={() => setResetPasswordPopupOpen(false)}
            onSubmit={handleResetPassword}
          />
        )}
      </Popup>
      {showDeleteConfirm && (
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
      )}

      {showSuspendConfirm && (
        <Popup isOpen={showSuspendConfirm} onClose={handleSuspendCancel}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t(userData?.user.isVerified ? "are_you_sure_suspend" : "are_you_sure_activate")}
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
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("company_details")}
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
              onClick={() => setResetPasswordPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
                  <Lock />
                </span>
              }
              variant="secondary"
            />
            <Button
              label={t(userData?.user.isVerified ? "buttons.suspend" : "buttons.activate")}
              onClick={() => setShowSuspendConfirm(true)}
              icon={
                <span className="inline-block w-6">
                  <Suspend />
                </span>
              }
              variant="dark"
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
        <h1 className="heading3">{t("company_details")}</h1>
        <div className="flex items-center gap-3 rounded-lg border border-gray-900 border-opacity-50 p-4">
          <ImageWithFallback
            src={`${process.env.NEXT_PUBLIC_URL}/${userData?.user.avatar}`}
            alt="staff-profile"
            width={80}
            height={80}
            className="rounded-full object-cover w-20 h-20"
          />
          <h2 className="heading2">
            {userData?.user.firstName} {userData?.user.lastName}
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <GroupInfo
            label={t("phone_number")}
            content={userData?.user.phone}
            copyIt
            icon={<PhoneIcon />}
          />
          <GroupInfo
            label={t("company_email")}
            content={userData?.user.email}
            copyIt
            icon={<Buildings2 />}
          />
          <GroupInfo
            label={t("status")}
            content={
              <Status status={userData.status.toString()} />
            }
            icon={<StatusCheck />}
          />
        </div>
      </div>
    </div>
  );
}
