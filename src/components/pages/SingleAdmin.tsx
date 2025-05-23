"use client";
import type { Admin } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import ImageWithFallback from "../ui/ImageWithFallback";
import Status from "../ui/Status";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Lock from "../ui/icons/Lock";
import PhoneIcon from "../ui/icons/PhoneIcon";
import Suspend from "../ui/icons/Suspend";
import StatusCheck from "../ui/icons/StatusCheck";
import { useRouter } from "@/i18n/routing";
import { deleteAdmin, fetchAdminById, resetAdminPassword, toggleAdminVerification } from "@/api/adminService";
import Popup from "../ui/Popup";
import NewAdminForm from "../forms/NewAdminForm";
import ResetPasswordForm from "../forms/ResetPasswordForm";
import { showToast } from "@/utils/toast";
import UserSquare from "../ui/icons/UserSquare";
import { AdminStatus, AdminVmStatus } from "@/enum/admin-status.enum";

interface SingleAdminProps {
  adminData: Admin;
  adminID: string;
}

export default function SingleAdmin({ adminData: initialAdminData, adminID }: SingleAdminProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [adminData, setAdminData] = useState<Admin>(initialAdminData);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [resetPasswordPopupOpen, setResetPasswordPopupOpen] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const router = useRouter();

  const getAdminData = useCallback(async () => {
    try {
      const response = await fetchAdminById(adminID);
       if (response && response.admin) {
         setAdminData({
           ...response.admin,
           userType: response.admin.type,
           avatar: response.admin.image
         });
       } else {
         throw new Error("Admin data not found in response");
       }
    } catch (error) {
      console.error("Error refetching admin data:", error);
      setError(tMsgs("error_fetching_data"));
      showToast.error(tMsgs("error_fetching_data"));
    }
  }, [adminID, tMsgs]);

  // Initial fetch and refetch on popup close
  useEffect(() => {
    getAdminData();
  }, [getAdminData]);

  const handleCloseEditPopup = async () => {
    setEditPopupOpen(false);
    await getAdminData(); // Refetch data when edit popup closes
  };

  const handleDelete = async () => {
    if (!adminData?.id) return;
    try {
      const result = await deleteAdmin(Number(adminData.id));
      if (result.success) {
        showToast.success(tMsgs("admin_deleted_successfully"));
        router.push("/dashboard/admin-management/manage-admins"); // Navigate to admin list
      } else {
        setError(result.error || tMsgs("error_deleting_admin"));
        showToast.error(result.error || tMsgs("error_deleting_admin"));
      }
    } catch (err) {
       const errorMsg = err instanceof Error ? err.message : tMsgs("error_unexpected");
       setError(errorMsg);
       showToast.error(errorMsg);
    } finally {
       setShowDeleteConfirm(false);
    }
  };

  const handleResetPassword = async (newPassword: string) => {
     if (!adminData?.id) return;
    try {
      const result = await resetAdminPassword(Number(adminData.id), newPassword);
      if (result.success) {
        setResetPasswordSuccess(true);
        showToast.success(tMsgs("password_reset_success"));
        setTimeout(() => {
          setResetPasswordPopupOpen(false);
          setResetPasswordSuccess(false);
        }, 2000);
      } else {
        setError(result.error || tMsgs("error_resetting_password"));
        showToast.error(result.error || tMsgs("error_resetting_password"));
      }
    } catch (err) {
       const errorMsg = err instanceof Error ? err.message : tMsgs("error_unexpected");
       setError(errorMsg);
       showToast.error(errorMsg);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Adjust verification logic if needed for Admins
  const handleToggleVerification = async () => {
     if (!adminData?.id) return;
    try {
      // Assuming toggleAdminVerification exists and works similarly
      const result = await toggleAdminVerification(Number(adminData.id), !adminData.isVerified);
      if (result.success) {
        await getAdminData(); // Refetch data
        showToast.success(tMsgs(
          adminData.isVerified ? "admin_suspended_successfully" : "admin_activated_successfully"
        ));
      } else {
        setError(result.error || tMsgs("error_updating_status"));
        showToast.error(result.error || tMsgs("error_updating_status"));
      }
    } catch (err) {
       const errorMsg = err instanceof Error ? err.message : tMsgs("error_unexpected");
       setError(errorMsg);
       showToast.error(errorMsg);
    } finally {
       setShowSuspendConfirm(false);
    }
  };

  const handleSuspendCancel = () => {
    setShowSuspendConfirm(false);
  };

  // Update breadcrumbs for Admin management
  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("admin-management"), href: "/dashboard/admin-management" },
    { label: t("manage-admins"), href: "/dashboard/admin-management/manage-admins" },
    { label: adminData?.name || t("admin_details"), href: `/dashboard/admin-management/manage-admins/${adminID}` }, // Dynamic label
  ];

  if (!adminData) return <div>{t("loading")}...</div>; // Or a loading spinner
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="h-full">
      {/* Edit Admin Popup */}
      <Popup isOpen={editPopupOpen} onClose={handleCloseEditPopup}>
        <NewAdminForm
          title={t("edit_admin")}
          sub_title={t("form_subtitle")}
          onClose={handleCloseEditPopup}
          adminData={adminData ? {
            id: adminData.id,
            status: adminData.status === AdminVmStatus.ACTIVE ? AdminStatus.ACTIVE : AdminStatus.INACTIVE, // Map status back if needed
            userType: adminData.userType,
            user: {
              firstName: adminData.user.firstName,
              lastName: adminData.user.lastName,
              avatar: adminData.avatar, // Use top-level avatar
              email: adminData.email, // Use top-level email
              phone: adminData.phone, // Use top-level phone
              address: adminData.user.address || "", // Provide default if missing
              password: "", // Password is not needed for editing initial values
              isVerified: adminData.isVerified,
              roleId: adminData.user.roleId,
            }
          } : null}
        />
      </Popup>

      {/* Reset Password Popup */}
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

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <Popup isOpen={showDeleteConfirm} onClose={handleDeleteCancel}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t("are_you_sure_delete")} {/* Consider specific message for admin */}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleDelete} label={t("buttons.confirm")} variant="danger"/>
              <Button
                onClick={handleDeleteCancel}
                label={t("buttons.cancel")}
                variant="dark"
              />
            </div>
          </div>
        </Popup>
      )}

      {/* Suspend/Activate Confirmation Popup (if applicable) */}
      {showSuspendConfirm && (
        <Popup isOpen={showSuspendConfirm} onClose={handleSuspendCancel}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t(adminData?.isVerified ? "are_you_sure_suspend" : "are_you_sure_activate")} {/* Adjust text */}
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

      {/* Page Header */}
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("admin_details")} // Changed title
        actions={
          <>
            <Button
              label={t("buttons.edit")}
              onClick={() => setEditPopupOpen(true)}
              icon={<span className="inline-block w-6"><Edit2 /></span>}
              variant="primary"
            />
            <Button
              label={t("buttons.reset_password")}
              onClick={() => setResetPasswordPopupOpen(true)}
              icon={<span className="inline-block w-6"><Lock /></span>}
              variant="secondary"
            />
            {/* Conditionally render Suspend/Activate button if applicable */}
            <Button
              label={t(adminData?.isVerified ? "buttons.suspend" : "buttons.activate")}
              onClick={() => setShowSuspendConfirm(true)}
              icon={<span className="inline-block w-6"><Suspend /></span>}
              variant="dark"
            />
            <Button
              label={t("buttons.delete")}
              onClick={() => setShowDeleteConfirm(true)}
              icon={<span className="inline-block w-6"><Delete /></span>}
              variant="danger"
            />
          </>
        }
      />

      {/* Admin Details Section */}
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
        <h1 className="heading3">{t("admin_details")}</h1>
        <div className="flex items-center gap-3 rounded-lg border border-gray-900 border-opacity-50 p-4">
          <ImageWithFallback
            src={`${process.env.NEXT_PUBLIC_URL}/${adminData?.avatar}`} // Use admin avatar
            alt="admin-profile"
            width={80}
            height={80}
            className="rounded-full object-cover w-20 h-20"
          />
          <h2 className="heading2">
            {adminData?.name} {/* Display admin name */}
          </h2>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-y-4"> {/* Added flex-wrap and gap-y */}
          <GroupInfo
            label={t("phone_number")}
            content={adminData?.phone} // Use admin phone
            copyIt
            icon={<PhoneIcon />}
          />
          <GroupInfo
            label={t("email")} // Changed label
            content={adminData?.email} // Use admin email
            copyIt
            icon={<UserSquare />} // Changed icon
          />
          {adminData?.status}
          <GroupInfo
            label={t("status")}
            key={adminData?.status} // This will force Status to re-mount on status change
            content={<Status status={adminData?.status} />} // Use admin status
            icon={<StatusCheck />}
          />
           {/* Add other relevant admin info here using GroupInfo */}
        </div>
      </div>
    </div>
  );
}