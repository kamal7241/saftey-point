"use client";
import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { fetchPartnerById, deletePartner } from "@/api/partnerService";
import { showToast } from "@/utils/toast";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import StatusCheck from "../ui/icons/StatusCheck";
import Popup from "../ui/Popup";
import Status from "../ui/Status";
import ImageWithFallback from "../ui/ImageWithFallback";
import NewPartnerForm from "../forms/NewPartnerForm";
import { Partner } from "@/types/ui.types";
// import NewPartnerForm from "../forms/NewPartnerForm"; // Uncomment and implement if edit is needed


interface SinglePartnerProps {
  partnerData: Partner;
  partnerID: string;
}

const SinglePartner = ({ partnerData, partnerID }: SinglePartnerProps) => {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const router = useRouter();
  const [currentPartnerData, setCurrentPartnerData] = useState<Partner>(partnerData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPartnerData = useCallback(async () => {
    try {
      const newData = await fetchPartnerById(partnerID);
      setCurrentPartnerData(newData.data);
      setError(null);
    } catch (err) {
      console.error("Error refetching partner data:", err);
      setError(tMsgs("error_fetching_data"));
      showToast.error(tMsgs("error_fetching_data"));
    }
  }, [partnerID, tMsgs]);

  useEffect(() => {
    getPartnerData();
  }, []);

  const handleClose = () => {
    setAddPopupOpen(false);
    getPartnerData();
  };

  const handleDelete = async () => {
    try {
      const result = await deletePartner(currentPartnerData.id);
      if (result.success) {
        showToast.success(tMsgs("partner_deleted_successfully"));
        router.push("/dashboard/presets/partner");
      } else {
        setError(result.message || tMsgs("error_deleting_partner"));
        showToast.error(result.message || tMsgs("error_deleting_partner"));
      }
    } catch (err) {
      console.error("Error deleting partner:", err);
      const errorMsg = err instanceof Error ? err.message : tMsgs("error_unexpected");
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("presets"), href: "/dashboard/presets" },
    { label: t("partner"), href: "/dashboard/presets/partners" },
    { label: currentPartnerData.name, href: `/dashboard/presets/partners/${partnerID}` },
  ];

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!currentPartnerData) return <div>{t("loading")}...</div>;

  return (
    <div className="h-full">
      <Popup isOpen={addPopupOpen} onClose={handleClose}>
        <NewPartnerForm
          title={t("edit_partner")}
          sub_title={t("form_subtitle")}
          onClose={handleClose}
          partnerData={currentPartnerData}
        />
      </Popup>

      {showDeleteConfirm && (
        <Popup isOpen={showDeleteConfirm} onClose={handleDeleteCancel}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t("are_you_sure_delete")}
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
        title={t("partner_details")}
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
        <h1 className="heading3">{t("partner_details")}</h1>
        <ImageWithFallback
          src={`${process.env.NEXT_PUBLIC_URL}${currentPartnerData?.logo}`}
          alt="Partner-logo"
          width={80}
          height={80}
          className="rounded-full object-cover w-20 h-20"
        />
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("name")}
              content={currentPartnerData.name}
              icon={<StatusCheck />}
            />
            <GroupInfo
              label={t("website")}
              content={currentPartnerData.website ? (
                <a href={currentPartnerData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{currentPartnerData.website}</a>
              ) : "-"}
              icon={<StatusCheck />}
            />
            <GroupInfo
              label={t("status")}
              content={<Status status={currentPartnerData.deletedAt ? "0" : "1"} />}
              icon={<StatusCheck />}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("created_at")}
              content={new Date(currentPartnerData.createdAt).toLocaleDateString()}
              icon={<StatusCheck />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePartner;