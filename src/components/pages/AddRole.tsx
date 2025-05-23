"use client";
import React, { useState } from "react";
import PermissionForm from "../forms/PermissionForm";
import { useTranslations } from "next-intl";
import PageHeader from "../global/PageHeader";
import { createRole } from "@/api/roleService";
import { showToast } from "@/utils/toast";

export default function AddRole() {
  const t = useTranslations("common");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    permissions: ""
  });

  const [sections, setSections] = useState([
    {
      title: t("admin_management"),
      permissions: [
        { name: t("create"), isActive: false },
        { name: t("delete"), isActive: false },
        { name: t("update"), isActive: false },
        { name: t("list"), isActive: false },
        { name: t("find"), isActive: false },
      ],
    },
    {
      title: t("role_management"),
      permissions: [
        { name: t("create"), isActive: false },
        { name: t("delete"), isActive: false },
        { name: t("update"), isActive: false },
        { name: t("list"), isActive: false },
        { name: t("find"), isActive: false },
      ],
    },
    {
      title: t("staff_management"),
      permissions: [
        { name: t("create"), isActive: false },
        { name: t("delete"), isActive: false },
        { name: t("update"), isActive: false },
        { name: t("list"), isActive: false },
        { name: t("find"), isActive: false },
      ],
    },
    {
      title: t("company_management"),
      permissions: [
        { name: t("create"), isActive: false },
        { name: t("delete"), isActive: false },
        { name: t("update"), isActive: false },
        { name: t("list"), isActive: false },
        { name: t("find"), isActive: false },
      ],
    },
    {
      title: t("individual_management"),
      permissions: [
        { name: t("create"), isActive: false },
        { name: t("delete"), isActive: false },
        { name: t("update"), isActive: false },
        { name: t("list"), isActive: false },
        { name: t("find"), isActive: false },
      ],
    },
    {
      title: t("courses_management"),
      permissions: [
        { name: t("create"), isActive: false },
        { name: t("delete"), isActive: false },
        { name: t("update"), isActive: false },
        { name: t("list"), isActive: false },
        { name: t("find"), isActive: false },
      ],
    },
  ]);

  const [formData, setFormData] = useState({
    key: "ADMIN",
    name: "",
    description: "",
    features: [],
  });

  const handleSubmit = async () => {
    // Validate form data
    if (!formData.name.trim()) {
      showToast.error("Role name is required");
      setErrors({ ...errors, name: "Role name is required" });
      return;
    }

    if (!formData.description.trim()) {
      showToast.error("Role description is required");
      setErrors({...errors, description: "Role description is required" });
      return;
    }

    // Validate at least one permission is selected
    const hasPermissions = sections.some(section => 
      section.permissions.some(p => p.isActive)
    );
    
    if (!hasPermissions) {
      showToast.error("Please select at least one permission");
      setErrors({...errors, permissions: "Please select at least one permission" });
      return;
    }

    try {
      const features = sections.map((section) => ({
        key: section.title.toUpperCase().replace(/\s+/g, "_"),
        name: section.title,
        create: section.permissions.some(p => p.name === "Create" && p.isActive),
        delete: section.permissions.some(p => p.name === "Delete" && p.isActive),
        update: section.permissions.some(p => p.name === "Update" && p.isActive),
        list: section.permissions.some(p => p.name === "List" && p.isActive),
        find: section.permissions.some(p => p.name === "Find" && p.isActive),
      }));

      const response = await createRole({
        ...formData,
        features,
      });

      if (response.success) {
        showToast.success(response.message);
        setTimeout(() => {
          window.location.href = "/dashboard/admin-management/roles-permissions";
        }, 2000);
      } else {
        showToast.error(response.message);
      }
    } catch (error) {
      showToast.error("Failed to create role");
      console.error("Error creating role:", error);
    }
  };

  const handleSectionsChange = (updatedSections: typeof sections) => {
    setSections(updatedSections);
  };

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
            isEditable={true}
            title2={t("permissions")}
            sub_title={t("form_subtitle")}
            sections={sections}
            formData={formData}
            onFormChange={(data) =>
              setFormData((prevData) => ({ ...prevData, ...data }))
            }
            onSectionsChange={handleSectionsChange}
            errors={errors}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
