"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Status from "../ui/Status";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Lock from "../ui/icons/Lock";
import PhoneIcon from "../ui/icons/PhoneIcon";
import Suspend from "../ui/icons/Suspend";
import MedalStar from "../ui/icons/MedalStar";
import UserSquare from "../ui/icons/UserSquare";
import AttachCircle from "../ui/icons/AttachCircle";
import StatusCheck from "../ui/icons/StatusCheck";
// import { Edit2 } from "../ui/icons/Edit2";

interface SingleUserProps {
  userID: string; // Define the type for userID
}

export default function SingleUser({ userID }: SingleUserProps) {
  const t = useTranslations("common");
  //   const [filtersOpen, setFiltersOpen] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);

  console.log("userID", userID);
  console.log("addPopupOpen", addPopupOpen);
  //   const handleExport = () => {
  //     console.log("Exporting data...");
  //   };

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
              onClick={() => setAddPopupOpen(true)}
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
          <Image
            src="/images/user-profile.png"
            alt="user-profile"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h2 className="heading2">{`Steven O'Reilly`}</h2>
        </div>
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("job_title")}
              content={"International Web Administrator"}
              icon={<MedalStar />}
            />
            <GroupInfo
              label={t("phone_number")}
              content={"0122939383383"}
              copyIt
              icon={<PhoneIcon />}
            />
            <GroupInfo
              label={t("email")}
              content={"bill.sanders@example.com"}
              copyIt
              icon={<Buildings2 />}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("userType")}
              content={t("user_type.company")}
              icon={<UserSquare />}
            />
            <GroupInfo
              label={t("company_name")}
              content={
                <span>
                  <Image
                    src="/images/company-profile.png"
                    alt="user-profile"
                    width={24}
                    height={24}
                    className="rounded-full align-middle me-2 inline-block"
                  />
                  Abernathy - Stoltenberg
                </span>
              }
              copyIt
              icon={<Buildings2 />}
            />
            <GroupInfo
              label={t("status")}
              content={<Status status={"1"} />}
              icon={<StatusCheck />}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <GroupInfo
              label={t("front_id")}
              content={"Front ID.pdf"}
              copyIt
              icon={<AttachCircle />}
            />
            <GroupInfo
              label={t("back_id")}
              content={"Back ID.pdf"}
              copyIt
              icon={<AttachCircle />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
