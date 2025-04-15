"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Status from "../ui/Status";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import Task from "../ui/icons/Task";
import Suspend from "../ui/icons/Suspend";
import StatusCheck from "../ui/icons/StatusCheck";
import PermissionForm from "../forms/PermissionForm";
// import { Edit2 } from "../ui/icons/Edit2";

interface SingleBranchProps {
  adminId: string; // Define the type for adminId
}

export default function RoleView({ adminId }: SingleBranchProps) {
  const t = useTranslations("common");
  //   const [filtersOpen, setFiltersOpen] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);

  console.log("adminId", adminId);
  console.log("addPopupOpen", addPopupOpen);
  //   const handleExport = () => {
  //     console.log("Exporting data...");
  //   };
  const sections = [
    {
      title: "Admin Management",
      permissions: [
        { name: "View", isActive: true },
      ],
    },
    {
      title: "Company Management",
      permissions: [
        { name: "View", isActive: true },
      ],
    },
    {
      title: "User Management",
      permissions: [
        { name: "Edit", isActive: true },
        { name: "View", isActive: true },
      ],
    },
    {
      title: "Courses Management",
      permissions: [
        { name: "Add", isActive: true },
        { name: "Edit", isActive: true },
        { name: "View", isActive: true },
      ],
    },
    {
      title: "Documentation",
      permissions: [
        { name: "Add", isActive: true },
      ],
    },
  ];

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("admin-management"), href: "/dashboard/admin-management" },
    {
      label: t("view_role"),
      href: "/dashboard/admin-management/manage-admins",
    },
  ];
  return (
    <div className="h-full">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("view_role")}
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
        <h1 className="heading3">{t("role_details")}</h1>
        <div className="flex items-center justify-between gap-8 flex-wrap">
          <GroupInfo
            label={t("name")}
            content={"Ahmed Ail"}
            copyIt
            icon={<Buildings2 />}
          />
          <GroupInfo
            label={t("status")}
            content={<Status status={"1"} />}
            icon={<StatusCheck />}
          />
          <GroupInfo label={t("role")} content={"Admin"} icon={<Task />} />
        </div>
        <h3 className="heading3">{t("permissions")}</h3>
        {/* <PermissionForm title2={t("permissions")} sections={sections} inView /> */}
      </div>
    </div>
  );
}
