"use client";
import { deleteStaff, resetStaffPassword, toggleStaffVerification } from "@/api/staffService";
import { useRouter } from "@/i18n/routing";
import type { SingleStaff } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Lock from "../ui/icons/Lock";
import PhoneIcon from "../ui/icons/PhoneIcon";
import StatusCheck from "../ui/icons/StatusCheck";
import Suspend from "../ui/icons/Suspend";
import MedalStar from "../ui/icons/MedalStar";
import ImageWithFallback from "../ui/ImageWithFallback";
import Popup from "../ui/Popup";
import Status from "../ui/Status";
import Note from "../ui/icons/Note";
import Teacher from "../ui/icons/Teacher";
import NewStaffForm from "../forms/NewStaffForm";
import SomethingWentWrong from "../ui/SomethingWentWrong";
import ResetPasswordForm from "../forms/ResetPasswordForm";

interface SingleStaffProps {
  staffData: SingleStaff;
}

export default function SingleStaff({ staffData }: SingleStaffProps) {
  const t = useTranslations("common");
  const [userData] = useState<SingleStaff>(staffData);
  const [error, setError] = useState<string | null>(null);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [resetPasswordPopupOpen, setResetPasswordPopupOpen] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteStaff(Number(userData?.id));
    if (result.success) {
      router.push("/dashboard/staff-management");
    } else {
      setError(result.error || "Failed to delete staff.");
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };
  const handleClose = async () => {
    setAddPopupOpen(false);
    window.location.reload();
  };

  const handleToggleVerification = async () => {
    try {
      const result = await toggleStaffVerification(
        Number(userData?.id),
        // userData?.status
        (userData?.status === "ACTIVE") ? "INACTIVE" : "ACTIVE"
      );
      if (result.success) {
        handleClose();
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
  const handleResetPassword = async (newPassword: string) => {
    try {
      const result = await resetStaffPassword(
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
  if (error) return <div>{error}</div>;

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("staff-management"), href: "/dashboard/staff-management" },
    {
      label: t("user_details"),
      href: "/dashboard/staff-management",
    },
  ];

  if (!userData) return <SomethingWentWrong />;
  return (
    <div className="h-full">
      <Popup isOpen={addPopupOpen} onClose={handleClose}>
        <NewStaffForm
          title={t("edit_staff")}
          sub_title={t("form_subtitle")}
          onClose={handleClose}
          userData={userData}
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
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("staff_details")}
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
              label={t(userData?.status ? "buttons.suspend" : "buttons.activate")}
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
        <h1 className="heading3">{t("staff_details")}</h1>
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
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("role")}
              content={t(`user_role.${userData?.userType.toLowerCase()}`)}
              icon={<MedalStar />}
            />
            <GroupInfo
              label={t("phone_number")}
              content={userData?.user.phone}
              copyIt
              icon={<PhoneIcon />}
            />
            <GroupInfo
              label={t("email")}
              content={userData?.user.email}
              copyIt
              icon={<Buildings2 />}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("resume")}
              content={"missing from API"}
              icon={<Note />}
            />
            <GroupInfo
              label={t("status")}
              content={<Status status={userData?.status} />}
              icon={<StatusCheck />}
            />
            <GroupInfo
              label={t("certificates")}
              content={"missing from API"}
              icon={<Teacher />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
