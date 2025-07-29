"use client";
import { deleteStaff, resetStaffPassword, toggleStaffVerification } from "@/api/staffService";
import { useRouter } from "@/i18n/routing";
import type { SingleStaff } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faIdCard,
  faCalendarAlt,
  faBuilding,
  faTrash,
  faLock,
  faPhone,
  faCheckCircle,
  faPause,
  faStar,
  faStickyNote,
  faUserTie,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import ImageWithFallback from "../ui/ImageWithFallback";
import Popup from "../ui/Popup";
import Status from "../ui/Status";
import NewStaffForm from "../forms/NewStaffForm";
import SomethingWentWrong from "../ui/SomethingWentWrong";
import ResetPasswordForm from "../forms/ResetPasswordForm";
import Loader from "../ui/Loader";

interface SingleStaffProps {
  staffData: SingleStaff | null;
  staffId?: string;
}

export default function SingleStaff({ staffData, staffId }: SingleStaffProps) {
  const t = useTranslations("common");
  const [userData, setUserData] = useState<SingleStaff | null>(staffData);
  const [loading, setLoading] = useState(!staffData);
  const [error, setError] = useState<string | null>(null);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [resetPasswordPopupOpen, setResetPasswordPopupOpen] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const router = useRouter();

  // Fetch staff data if not provided
  useEffect(() => {
    const fetchStaffData = async () => {
      if (!staffData && staffId) {
        try {
          setLoading(true);
          setError(null);
          const { fetchStaffById } = await import("@/api/staffService");
          const fetchedUser = await fetchStaffById(Number(staffId));
          if (fetchedUser) {
            setUserData(fetchedUser);
          } else {
            setError("Staff not found");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch staff data");
        } finally {
          setLoading(false);
        }
      } else if (staffData) {
        setUserData(staffData);
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [staffData, staffId]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  // Show error state
  if (error || !userData) {
    return <SomethingWentWrong message={error || "Staff not found"} />;
  }

  const handleDelete = async () => {
    const result = await deleteStaff(Number(userData?.staff?.id));
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
        Number(userData?.staff?.id),
        (userData?.staff?.status === "ACTIVE") ? "INACTIVE" : "ACTIVE"
      );
      if (result.success) {
        handleClose();
      } else {
        setError(result.error || "Failed to update staff status");
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
        Number(userData?.staff?.id),
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
      label: userData ? `${userData.firstName} ${userData.lastName}` : t("user_details"),
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
              {t(userData?.staff?.status === "ACTIVE" ? "are_you_sure_suspend" : "are_you_sure_activate")}
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
                  <FontAwesomeIcon icon={faEdit} />
                </span>
              }
              variant="primary"
            />
            <Button
              label={t("buttons.reset_password")}
              onClick={() => setResetPasswordPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              }
              variant="dark"
            />
            <Button
              label={t(userData?.staff?.status === "ACTIVE" ? "buttons.suspend" : "buttons.activate")}
              onClick={() => setShowSuspendConfirm(true)}
              icon={
                <span className="inline-block w-6">
                  <FontAwesomeIcon icon={faPause} />
                </span>
              }
              variant="dark"
            />
            <Button
              label={t("buttons.delete")}
              onClick={() => setShowDeleteConfirm(true)}
              icon={
                <span className="inline-block w-6">
                  <FontAwesomeIcon icon={faTrash} />
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
            src={`${process.env.NEXT_PUBLIC_URL}/${userData?.avatar}`}
            alt="staff-profile"
            width={80}
            height={80}
            className="rounded-full object-cover w-20 h-20"
          />
          <h2 className="heading2">
            {userData?.firstName} {userData?.lastName}
          </h2>
        </div>
        <div className="flex flex-col gap-10">
          {/* Basic Information */}
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("staff_id")}
              content={userData?.staff?.id}
              icon={<FontAwesomeIcon icon={faIdCard} />}
            />
            <GroupInfo
              label={t("phone_number")}
              content={userData?.phone}
              copyIt
              icon={<FontAwesomeIcon icon={faPhone} />}
            />
            <GroupInfo
              label={t("email")}
              content={userData?.email}
              copyIt
              icon={<FontAwesomeIcon icon={faBuilding} />}
            />
          </div>

          {/* Role Information */}
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("role")}
              content={userData?.staff?.staffRole?.name || t("no_role")}
              icon={<FontAwesomeIcon icon={faUserTie} />}
            />
            <GroupInfo
              label={t("user_type")}
              content={userData?.staff?.userType}
              icon={<FontAwesomeIcon icon={faUserTie} />}
            />
            <GroupInfo
              label={t("verification_status")}
              content={<Status status={userData?.isVerified ? "ACTIVE" : "INACTIVE"} />}
              icon={<FontAwesomeIcon icon={faCheckCircle} />}
            />
          </div>

          {/* Role Description */}
          {userData?.staff?.staffRole?.description && (
            <div className="grid grid-cols-1 gap-6">
              <GroupInfo
                label={t("role_description")}
                content={userData.staff.staffRole.description}
                icon={<FontAwesomeIcon icon={faStar} />}
              />
            </div>
          )}

          {/* Permissions */}
          {userData?.staff?.staffRole?.permissions && userData.staff.staffRole.permissions.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              <GroupInfo
                label={t("permissions")}
                content={
                  <div className="flex flex-wrap gap-2">
                    {userData.staff.staffRole.permissions.map((permission, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                }
                icon={<FontAwesomeIcon icon={faShieldAlt} />}
              />
            </div>
          )}

          {/* Resume and Status */}
          <div className="grid grid-cols-2 gap-6">
            <GroupInfo
              label={t("resume")}
              content={
                userData?.staff?.resume ? (
                  <a
                    href={`${process.env.NEXT_PUBLIC_URL}/${userData.staff.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {t("download_resume")}
                  </a>
                ) : (
                  t("no_resume_available")
                )
              }
              icon={<FontAwesomeIcon icon={faStickyNote} />}
            />
            <GroupInfo
              label={t("status")}
              content={<Status status={userData?.staff?.status} />}
              icon={<FontAwesomeIcon icon={faCheckCircle} />}
            />
          </div>

          {/* Timestamps */}
          {userData?.staff?.staffRole?.createdAt && (
            <div className="grid grid-cols-2 gap-6">
              <GroupInfo
                label={t("created_at")}
                content={new Date(userData.staff.staffRole.createdAt).toLocaleDateString()}
                icon={<FontAwesomeIcon icon={faCalendarAlt} />}
              />
              <GroupInfo
                label={t("updated_at")}
                content={new Date(userData.staff.staffRole.updatedAt).toLocaleDateString()}
                icon={<FontAwesomeIcon icon={faCalendarAlt} />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
