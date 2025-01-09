"use client";
import React from "react";
import PermissionForm from "../forms/PermissionForm";
import { useTranslations } from "next-intl";
import PageHeader from "../global/PageHeader";
// import Button from "../ui/Button";

export default function AddRole() {
  const t = useTranslations("common");
  const sections = [
    {
      title: "Admin Management",
      permissions: [
        { name: "Add", isActive: false },
        { name: "Edit", isActive: false },
        { name: "Delete", isActive: false },
        { name: "View", isActive: true },
      ],
    },
    {
      title: "Company Management",
      permissions: [
        { name: "Add", isActive: false },
        { name: "Edit", isActive: false },
        { name: "Delete", isActive: false },
        { name: "View", isActive: true },
      ],
    },
    {
      title: "User Management",
      permissions: [
        { name: "Add", isActive: false },
        { name: "Edit", isActive: true },
        { name: "Delete", isActive: false },
        { name: "View", isActive: false },
      ],
    },
    {
      title: "Courses Management",
      permissions: [
        { name: "Add", isActive: false },
        { name: "Edit", isActive: true },
        { name: "Delete", isActive: false },
        { name: "View", isActive: false },
      ],
    },
    {
      title: "Documentation",
      permissions: [
        { name: "Add", isActive: true },
        { name: "Edit", isActive: false },
        { name: "Delete", isActive: false },
        { name: "View", isActive: false },
      ],
    },
  ];

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("admin-management"), href: "/dashboard/admin-management" },
    {
      label: t("add_role"),
      href: "/dashboard/admin-management/add-role",
    },
  ];
  return (
    <div className="h-full">
      <PageHeader breadcrumbItems={breadcrumbItems} title={t("add_role")} />
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
        <div>
          <PermissionForm
            title={t("add_role")}
            title2={t("permissions")}
            sub_title={t("add_role_subtitle")}
            sections={sections}
          />
        </div>
      </div>
    </div>
  );
}
