"use client";
import { deleteIndividual, fetchUserById, resetUserPassword, toggleUserStatus, toggleUserVerification } from "@/api/usersService";
import { IndividualResponse } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Status from "../ui/Status";
import AttachCircle from "../ui/icons/AttachCircle";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Lock from "../ui/icons/Lock";
import MedalStar from "../ui/icons/MedalStar";
import PhoneIcon from "../ui/icons/PhoneIcon";
import StatusCheck from "../ui/icons/StatusCheck";
import Suspend from "../ui/icons/Suspend";
import UserSquare from "../ui/icons/UserSquare";
import Popup from "../ui/Popup";
import NewUserForm from "../forms/NewUserForm";
import { useRouter } from "@/i18n/routing";
import ImagePopup from "../ui/ImagePopup";
import ImageWithFallback from "../ui/ImageWithFallback";
import { showToast } from "@/utils/toast";
import ResetPasswordForm from "../forms/ResetPasswordForm";

interface SingleUserProps {
  userID: string;
}

export default function SingleUser({ userID }: SingleUserProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [userData, setUserData] = useState<IndividualResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [resetPasswordPopupOpen, setResetPasswordPopupOpen] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const router = useRouter();

  const getUserData = useCallback(async () => {
    setLoading(true);
    const data = await fetchUserById(Number(userID));
    if (data) {
      setUserData(data);
      setLoading(false);
    } else {
      setError("Failed to fetch user data.");
      setLoading(false);
    }
  }, [userID]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  useEffect(() => {
    if (!addPopupOpen) {
      getUserData();
    }
  }, [addPopupOpen, getUserData]);

  const handleDelete = async () => {
    const result = await deleteIndividual(Number(userID));
    if (result.success) {
      router.push("/dashboard/user-management/users");
    } else {
      setError(result.error || "Failed to delete user.");
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };
  const handleResetPassword = async (newPassword: string) => {
    try {
      const result = await resetUserPassword(Number(userData?.id), newPassword);

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

  const handleToggleVerification = async () => {
    try {
      // const result = await toggleUserVerification(
      //   Number(userData?.id),
      //   !userData?.isVerified
      // );
      const result = await toggleUserVerification(Number(userData?.id), (userData?.status.toLowerCase() === "active") ? "INACTIVE" : "ACTIVE");
      if (result.success) {
        const newData = await fetchUserById(Number(userID));
        setUserData(newData);
        showToast.success(tMsgs(
          userData?.isVerified
            ? "user_suspended_successfully"
            : "user_activated_successfully"
        ));
      } else {
        setError(result.error || "Failed to update user status");
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
  const handleStatusCancel = () => {
    setShowStatusConfirm(false);
  };
  const handleToggleStatus = async () => {
    try {
      const result = await toggleUserStatus(
        Number(userData?.id),
        userData?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      );
      if (result.success) {
        const newData = await fetchUserById(Number(userID));
        setUserData(newData);
        showToast.success(tMsgs(
          userData?.status === "ACTIVE"
            ? "user_suspended_successfully"
            : "user_activated_successfully"
        ));
      } else {
        setError(result.error || "Failed to update user status");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
    setShowStatusConfirm(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("user-management"), href: "/dashboard/user-management" },
    {
      label: t("user_details"),
      href: "/dashboard/user-management/users",
    },
  ];
  return (
    <div className="h-full">
      <Popup isOpen={addPopupOpen} onClose={() => setAddPopupOpen(false)}>
        <NewUserForm
          title={t("edit_user")}
          sub_title={t("form_subtitle")}
          onClose={() => setAddPopupOpen(false)}
          userData={userData}
        />
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
              {t(userData?.isVerified ? "are_you_sure_suspend" : "are_you_sure_activate")}
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
      {showStatusConfirm && (
        <Popup isOpen={showStatusConfirm} onClose={handleStatusCancel}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t(userData?.status === "ACTIVE" ? "are_you_sure_suspend" : "are_you_sure_activate")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleToggleStatus} label={t("buttons.confirm")} />
              <Button
                onClick={handleStatusCancel}
                label={t("buttons.cancel")}
                variant="dark"
              />
            </div>
          </div>
        </Popup>
      )}
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("user_details")}
        actions={
          <>
            <Button
              label={t("buttons.edit")}
              onClick={() => setAddPopupOpen(true)}
              icon={<span className="inline-block w-6"><Edit2 /></span>}
              variant="primary"
            />
            <Button
              label={t("buttons.reset_password")}
              onClick={() => setResetPasswordPopupOpen(true)}
              icon={<span className="inline-block w-6"><Lock /></span>}
              variant="secondary"
            />
            <Button
              label={t(userData?.isVerified ? "buttons.suspend" : "buttons.activate")}
              onClick={() => setShowSuspendConfirm(true)}
              icon={<span className="inline-block w-6"><Suspend /></span>}
              variant="dark"
            />
            {/* <Button
              label={t(userData?.status === "ACTIVE" ? "buttons.deactivate" : "buttons.activate")}
              onClick={() => setShowStatusConfirm(true)}
              icon={<span className="inline-block w-6"><Suspend /></span>}
              variant="dark"
            /> */}
            <Button
              label={t("buttons.delete")}
              onClick={() => setShowDeleteConfirm(true)}
              icon={<span className="inline-block w-6"><Delete /></span>}
              variant="danger"
            />
          </>
        }
      />
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
        <h1 className="heading3">{t("user_details")}</h1>
        <div className="flex items-center gap-3 rounded-lg border border-gray-900 border-opacity-50 p-4">
          <ImageWithFallback
            src={`${process.env.NEXT_PUBLIC_URL}/${userData?.avatar}`}
            alt="user-profile"
            width={80}
            height={80}
            className="rounded-full object-cover w-20 h-20"
          />
          <h2 className="heading2">
            {userData?.firstName} {userData?.lastName}
          </h2>
        </div>
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("job_title")}
              content="missing from API"
              icon={<MedalStar />}
            />
            <GroupInfo
              label={t("phone_number")}
              content={userData?.phone}
              copyIt
              icon={<PhoneIcon />}
            />
            <GroupInfo
              label={t("email")}
              content={userData?.email}
              copyIt
              icon={<Buildings2 />}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("userType")}
              content={t(`user_type.${userData?.userType.toLowerCase()}`)}
              icon={<UserSquare />}
            />
            {userData?.userType !== "INDIVIDUAL" && (
              <GroupInfo
                label={t("company_name")}
                content={
                  <span>
                    <Image
                      src="/images/company-profile.png"
                      alt="user-profile"
                      width={24}
                      height={24}
                      className="me-2 inline-block rounded-full align-middle"
                    />
                    {userData?.userType}
                  </span>
                }
                copyIt
                icon={<Buildings2 />}
              />
            )}
            {/* <GroupInfo
              label={t("status")}
              content={<Status status={userData?.status.toString() ?? ""} />
              }
              icon={<StatusCheck />}
            /> */}
            <GroupInfo
              label={t("status")}
              content={<Status status={userData?.isVerified.toString() ?? ""} />
              }
              icon={<StatusCheck />}
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("userBOD")}
              content={userData?.birthday}
              icon={<UserSquare />}
            />
            <GroupInfo
              label={t("user_nationality")}
              content={userData?.countryId}
              icon={<UserSquare />}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("front_id")}
              content={<ImagePopup imagePath={userData?.nationalIdFront} />}
              icon={<AttachCircle />}
            />
            <GroupInfo
              label={t("back_id")}
              content={<ImagePopup imagePath={userData?.nationalIdBack} />}
              icon={<AttachCircle />}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("nationalId")}
              content={userData?.nationalId}
              copyIt
              icon={<AttachCircle />}
            />
            <GroupInfo
              label={t("id_expiry")}
              content={userData?.nationalIdExpiry}
              copyIt
              icon={<AttachCircle />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}