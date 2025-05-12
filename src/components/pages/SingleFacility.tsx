"use client";
import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { fetchFacilityById, deleteFacility } from "@/api/presetsService";
import { showToast } from "@/utils/toast";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Note from "../ui/icons/Note";
import Popup from "../ui/Popup";
import NewFacilityForm from "../forms/NewFacilityForm";
import ImageWithFallback from "../ui/ImageWithFallback";

interface Facility {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  createdAt: string;
  deletedAt?: string | null;
}

interface SingleFacilityProps {
  facilityData: Facility;
  facilityID: string;
}

const SingleFacility = ({ facilityData, facilityID }: SingleFacilityProps) => {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const router = useRouter();
  const [currentFacilityData, setCurrentFacilityData] = useState<Facility>(facilityData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFacilityData = useCallback(async () => {
    try {
      const newData = await fetchFacilityById(facilityID);
      setCurrentFacilityData(newData.data);
      setError(null);
    } catch (err) {
      console.error("Error refetching facility data:", err);
      setError(tMsgs("error_fetching_data"));
      showToast.error(tMsgs("error_fetching_data"));
    }
  }, [facilityID, tMsgs]);

  useEffect(() => {
    getFacilityData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleClose = () => {
    setAddPopupOpen(false);
    window.location.reload();
  };

  const handleDelete = async () => {
    try {
      const result = await deleteFacility(currentFacilityData.id);
      if (result.success) {
        showToast.success(tMsgs("facility_deleted_successfully"));
        router.push("/dashboard/presets/facility");
      } else {
        setError(result.message || tMsgs("error_deleting_facility"));
        showToast.error(result.message || tMsgs("error_deleting_facility"));
      }
    } catch (err) {
      console.error("Error deleting facility:", err);
      const errorMsg = err instanceof Error ? err.message : tMsgs("error_unexpected");
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setShowDeleteConfirm(false); // Close confirmation popup regardless of outcome
    }
  };

  // Handler for canceling deletion
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };


  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("presets"), href: "/dashboard/presets" },
    { label: t("facility"), href: "/dashboard/presets/facility" },
    { label: currentFacilityData.title, href: `/dashboard/presets/facility/${facilityID}` },
  ];

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!currentFacilityData) return <div>{t("loading")}...</div>;


  return (
    <div className="h-full">
       <Popup isOpen={addPopupOpen} onClose={handleClose}>
        <NewFacilityForm
          title={t("edit_facility")}
          sub_title={t("form_subtitle")}
          onClose={handleClose}
          facilityData={{
            ...currentFacilityData,
            imageUrl: currentFacilityData.imageUrl || ''
          }}
        />
      </Popup>

      {/* Delete Confirmation Popup */}
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
        title={t("facility_details")}
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
        <h1 className="heading3">{t("facility_details")}</h1>
        <ImageWithFallback
            src={`${process.env.NEXT_PUBLIC_URL}/${currentFacilityData?.imageUrl}`}
            alt="Facilty-profile"
            width={80}
            height={80}
            className="rounded-full object-cover w-20 h-20"
          />
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("name")}
              content={currentFacilityData.title}
              icon={<Buildings2 />}
            />
            <GroupInfo
              label={t("description")}
              content={currentFacilityData.description}
              icon={<Note />}
            />
            {/* <GroupInfo
              label={t("status")}
              content={
                <Status status={currentFacilityData.deletedAt ? "0" : "1"} />
              }
              icon={<StatusCheck />}
            /> */}
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("created_at")}
              content={new Date(currentFacilityData.createdAt).toLocaleDateString()}
              icon={<Buildings2 />}
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default SingleFacility;
