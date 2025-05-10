/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Status from "../ui/Status";
import Edit2 from "../ui/icons/Edit2";
import Suspend from "../ui/icons/Suspend";
import { toggleCountryStatus, fetchCountryByCode } from "@/api/presetsService";

import { Country } from "@/types/ui.types";
import ClipboardTick from "../ui/icons/ClipboardTick";
import DocumentText from "../ui/icons/DocumentText";
import StatusCheck from "../ui/icons/StatusCheck";
import Popup from "../ui/Popup";
import NewCountryForm from "../forms/NewCountryForm";

interface SingleCountryProps {
  countryData: Country;
  countryID: string;
}

export default function SingleCountry({
  countryID,
  countryData,
}: SingleCountryProps) {
  const t = useTranslations("common");
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCountry, setCurrentCountry] = useState<Country>(countryData);

  const handleClose = () => {
    setAddPopupOpen(false);
    window.location.reload();
  };

  const handleSuspendCountry = async () => {
    setError(null);
    try {
      const result = await toggleCountryStatus(Number(countryData.id), !currentCountry.isActive);
      if (result.success) {
        // Refetch country data
        const refreshed = await fetchCountryByCode(countryID);
        if (refreshed.success && refreshed.data) {
          setCurrentCountry(refreshed.data);
        }
      } else {
        setError(result.message || "Failed to update country status");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
    setShowSuspendConfirm(false);
  };

  const handleSuspendCancel = () => {
    setShowSuspendConfirm(false);
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("presets"), href: "/dashboard/presets" },
    {
      label: t("country"),
      href: "",
    },
  ];
  return (
    <div className="h-full">
      <Popup isOpen={addPopupOpen} onClose={handleClose}>
        <NewCountryForm
          title={t("edit_country")}
          sub_title={t("form_subtitle")}
          onClose={handleClose}
          countryData={currentCountry}
        />
      </Popup>
      {showSuspendConfirm && (
        <Popup isOpen={showSuspendConfirm} onClose={handleSuspendCancel}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t(currentCountry.isActive ? "are_you_sure_suspend" : "are_you_sure_activate")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleSuspendCountry} label={t("buttons.confirm")}/>
              <Button
                onClick={handleSuspendCancel}
                label={t("buttons.cancel")}
                variant="dark"
              />
            </div>
            {error && <div className="text-red-500 text-center mt-2">{error}</div>}
          </div>
        </Popup>
      )}
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("view_country")}
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
              label={t(currentCountry.isActive ? "buttons.suspend" : "buttons.activate")}
              onClick={() => setShowSuspendConfirm(true)}
              icon={
                <span className={`inline-block w-6 ${(currentCountry.isActive) ? "" : "rotate-180"}`}>
                  <Suspend />
                </span>
              }
              variant={(currentCountry.isActive) ? "dark" : "success"}
            />
          </>
        }
      />
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
        <h1 className="heading3">{t("view_country")}</h1>

        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("country_code")}
              content={currentCountry.code}
              icon={<DocumentText />}
            />
            <GroupInfo
              label={t("country_name")}
              content={currentCountry.name}
              copyIt
              icon={<ClipboardTick />}
            />
            <GroupInfo
              label={t("status")}
              content={<Status status={currentCountry.isActive.toString()} />}
              icon={<StatusCheck />}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("emoji")}
              content={currentCountry.emoji}
              icon={<DocumentText />}
            />
            <GroupInfo
              label={t("phone_code")}
              content={currentCountry.phoneCode}
              icon={<DocumentText />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
