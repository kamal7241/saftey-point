"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Note from "../ui/icons/Note";
import StatusCheck from "../ui/icons/StatusCheck";
import Popup from "../ui/Popup";
import Status from "../ui/Status";

interface SingleFacilityProps {
  facilityData: {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
    deletedAt?: string | null;
  };
  facilityID: string;
}

const SingleFacility = ({ facilityData, facilityID }: SingleFacilityProps) => {
  const t = useTranslations("common");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("presets"), href: "/dashboard/presets" },
    { label: t("facility"), href: "/dashboard/presets/facility" },
  ];

  return (
    <div className="h-full">
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
        
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("name")}
              content={facilityData.title}
              icon={<Buildings2 />}
            />
            <GroupInfo
              label={t("description")}
              content={facilityData.description}
              icon={<Note />}
            />
            <GroupInfo
              label={t("status")}
              content={
                <Status status={facilityData.deletedAt ? "0" : "1"} />
              }
              icon={<StatusCheck />}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("created_at")}
              content={new Date(facilityData.createdAt).toDateString()}
              icon={<Buildings2 />}
            />
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <Popup isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t("are_you_sure_delete")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button 
                onClick={() => console.log('Delete facility')} 
                label={t("buttons.confirm")} 
              />
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                label={t("buttons.cancel")}
                variant="dark"
              />
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default SingleFacility;
