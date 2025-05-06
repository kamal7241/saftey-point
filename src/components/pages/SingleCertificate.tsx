"use client";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Suspend from "../ui/icons/Suspend";

import { deleteCertificate, fetchCertificateById } from "@/api/certificatesService";
import Image from "next/image";
import CalendarRemove from "../ui/icons/CalendarRemove";
import CalendarTick from "../ui/icons/CalendarTick";
import DocumentText from "../ui/icons/DocumentText";
import Level from "../ui/icons/Level";
import Teacher from "../ui/icons/Teacher";
import Popup from "../ui/Popup";
import NewCertificateForm from "../forms/NewCertificateForm";
import { showToast } from "@/utils/toast";
import { useRouter } from "@/i18n/routing";
// import { Edit2 } from "../ui/icons/Edit2";

interface SingleCertificateProps {
  certificateID: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export default function SingleCertificate({
  certificateID,
}: SingleCertificateProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [certificateData, setCertificateData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const getCertificateData = useCallback(async () => {
    setLoading(true);
    const data = await fetchCertificateById(Number(certificateID));
    if (data) {
      setCertificateData(data);
      setLoading(false);
    } else {
      setError("Failed to fetch Certificate data.");
      setLoading(false);
    }
  }, [certificateID]);
  


  const handleDelete = async () => {
    if (!certificateData?.id) return;
    try {
      const result = await deleteCertificate(Number(certificateData.id));
      if (result.success) {
        showToast.success(tMsgs("certificate_deleted_successfully"));
        router.push("/dashboard/user-management/certificates");
      } else {
        setError(result.error || tMsgs("error_updating_certificate"));
        showToast.error(result.error || tMsgs("error_updating_certificate"));
      }
    } catch (err) {
       const errorMsg = err instanceof Error ? err.message : tMsgs("error_unexpected");
       setError(errorMsg);
       showToast.error(errorMsg);
    } finally {
       setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    getCertificateData();
  }, [getCertificateData]);

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };
  const handleCloseEditPopup = async () => {
    setEditPopupOpen(false);
    getCertificateData();
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!certificateData) return <div>No Certificate data available.</div>;
  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("user-management"), href: "/dashboard/user-management" },
    {
      label: t("view_certificates"),
      href: "/dashboard/certificate-management/certificates",
    },
  ];
  return (
    <div className="h-full">
      {/* Edit Admin Popup */}
      <Popup isOpen={editPopupOpen} onClose={handleCloseEditPopup}>
        <NewCertificateForm
          title={t("buttons.edit_certificate")}
          sub_title={t("form_subtitle")}
          onClose={handleCloseEditPopup}
          certificateData={
            certificateData
              ? {
                  id: certificateData.id,
                  title: certificateData.title,
                  issueDate: certificateData.issueDate,
                  validFrom: certificateData.validFrom,
                  validTo: certificateData.validTo,
                  watermark: certificateData.watermark?"yes":"no",
                  displayScore: certificateData.displaySource?"yes":"no",
                }
              : null
          }
        />
      </Popup>

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <Popup isOpen={showDeleteConfirm} onClose={handleDeleteCancel}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t("are_you_sure_delete")}{" "}
              {/* Consider specific message for admin */}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleDelete}
                label={t("buttons.confirm")}
                variant="danger"
              />
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
        title={t("view_certificates")}
        actions={
          <>
            <Button
              label={t("buttons.edit")}
              onClick={() => setEditPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
                  <Edit2 />
                </span>
              }
              variant="primary"
            />
            <Button
              label={t("buttons.suspend")}
              // onClick={() => setAddPopupOpen(true)}
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
        <h1 className="heading3">{t("view_certificates")}</h1>

        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("certificate_id")}
              content={certificateData.id}
              icon={<DocumentText />}
            />
            <GroupInfo
              label={t("certificate_name")}
              content={certificateData.title}
              copyIt
              icon={<Teacher />}
            />
            <GroupInfo
              label={t("issue_date")}
              content={certificateData.issueDate}
              icon={<CalendarTick />}
            />
            <GroupInfo
              label={t("validFrom")}
              content={certificateData.validFrom}
              icon={<CalendarRemove />}
            />
            <GroupInfo
              label={t("validTo")}
              content={certificateData.validTo}
              icon={<CalendarRemove />}
            />
            <GroupInfo
              label={t("watermark")}
              content={certificateData.watermark ? t("yes") : t("no")}
              icon={<Level />}
            />
            <GroupInfo
              label={t("displaySource")}
              content={certificateData.displaySource ? t("yes") : t("no")}
              icon={<Level />}
            />
          </div>
          <h3 className="heading3">{t("view_certificates")}</h3>
          <Image
            src="/images/cert-template.jpg"
            alt="cert-template"
            width={853}
            height={627}
            className="my-4"
          />
        </div>
      </div>
    </div>
  );
}
