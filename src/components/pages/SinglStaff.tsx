"use client";
import { deleteStaff, fetchStaffById } from "@/api/dashboardService";
import { useRouter } from "@/i18n/routing";
import { Individual } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import NewUserForm from "../forms/NewUserForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import AttachCircle from "../ui/icons/AttachCircle";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Lock from "../ui/icons/Lock";
import PhoneIcon from "../ui/icons/PhoneIcon";
import StatusCheck from "../ui/icons/StatusCheck";
import Suspend from "../ui/icons/Suspend";
import UserSquare from "../ui/icons/UserSquare";
import ImagePopup from "../ui/ImagePopup";
import ImageWithFallback from "../ui/ImageWithFallback";
import Popup from "../ui/Popup";
import Status from "../ui/Status";

interface SinglStaffProps {
  staffID: string;
}

export default function SinglStaff({ staffID }: SinglStaffProps) {
  const t = useTranslations("common");
  const [userData, setUserData] = useState<Individual>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const getUserData = useCallback(async () => {
    setLoading(true);
    const data = await fetchStaffById(Number(staffID));
    if (data) {
      setUserData(data);
      setLoading(false);
    } else {
      setError("Failed to fetch staff data.");
      setLoading(false);
    }
  }, [staffID]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  useEffect(() => {
    if (!addPopupOpen) {
      getUserData();
    }
  }, [addPopupOpen, getUserData]);

  const handleDelete = async () => {
    const result = await deleteStaff(Number(staffID));
    if (result.success) {
      router.push("/dashboard/staff-management/users");
    } else {
      setError(result.error || "Failed to delete staff.");
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("staff-management"), href: "/dashboard/staff-management" },
    {
      label: t("user_details"),
      href: "/dashboard/staff-management/users",
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
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("user_details")}
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
        <h1 className="heading3">{t("user_details")}</h1>
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
              label={t("userType")}
              content={userData?.userType}
              icon={<UserSquare />}
            />
            {userData?.userType !== "INDIVIDUAL" && (
              <GroupInfo
                label={t("company_name")}
                content={
                  <span>
                    <Image
                      src="/images/company-profile.png"
                      alt="staff-profile"
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
            <GroupInfo
              label={t("status")}
              content={
                userData?.status === "ACTIVE" ? (
                  <Status status={"1"} />
                ) : (
                  <Status status={"0"} />
                )
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
              content={userData?.nationality}
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
