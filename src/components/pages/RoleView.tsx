"use client";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Status from "../ui/Status";
import Buildings2 from "../ui/icons/Buildings2";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import StatusCheck from "../ui/icons/StatusCheck";
import Task from "../ui/icons/Task";
import Popup from "../ui/Popup";
import {
  fetchRoleById,
  RoleFeature,
  RoleResponse,
  updateRole,
  deleteRole,
} from "@/api/roleService";
import { showToast } from "@/utils/toast";
import PermissionForm from "../forms/PermissionForm";
import SuccessMessage from "../ui/SuccessMessage";

type Permission = {
  name: string;
  isActive: boolean;
};

type PermissionSection = {
  title: string;
  permissions: Permission[];
};
interface SingleRoleProps {
  roleId: string;
  isEditing?: boolean;
}

const transformFeaturesToSections = (
  features: RoleFeature[]
): PermissionSection[] => {
  return features.map((feature) => ({
    title: feature.name,
    permissions: [
      { name: "Create", isActive: feature.create },
      { name: "Delete", isActive: feature.delete },
      { name: "Update", isActive: feature.update },
      { name: "List", isActive: feature.list },
      { name: "Find", isActive: feature.find },
    ],
  }));
};

const transformSectionsToFeatures = (
  sections: PermissionSection[]
): RoleFeature[] => {
  return sections.map((section) => {
    const permissionsMap = section.permissions.reduce((acc, p) => {
      acc[p.name.toLowerCase()] = p.isActive;
      return acc;
    }, {} as Record<string, boolean>);

    return {
      key: section.title.toUpperCase().replace(/\s+/g, "_"),
      name: section.title,
      create: permissionsMap["create"] ?? false,
      delete: permissionsMap["delete"] ?? false,
      update: permissionsMap["update"] ?? false,
      list: permissionsMap["list"] ?? false,
      find: permissionsMap["find"] ?? false,
    };
  });
};

export default function RoleView({
  roleId,
  isEditing: isInEditModel = false,
}: SingleRoleProps) {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(isInEditModel);
  const [roleData, setRoleData] = useState<RoleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [sectionsData, setSectionsData] = useState<PermissionSection[]>([]);
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    permissions: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoleById(roleId);
      if (data) {
        setRoleData(data);

        setFormData({ name: data.name, description: data.description });
        setSectionsData(transformFeaturesToSections(data.features));
      } else {
        setError("Role not found");
      }
    } catch (err) {
      console.error("Failed to fetch role:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch role");
    } finally {
      setLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    if (roleId) {
      fetchData();
    }
  }, [roleId]);

  const handleFormChange = (data: { name: string; description: string }) => {
    setFormData(data);
    if (formErrors.name && data.name)
      setFormErrors((prev) => ({ ...prev, name: "" }));
    if (formErrors.description && data.description)
      setFormErrors((prev) => ({ ...prev, description: "" }));
  };

  const handleSectionsChange = (updatedSections: PermissionSection[]) => {
    setSectionsData(updatedSections);
    if (
      formErrors.permissions &&
      updatedSections.some((s) => s.permissions.some((p) => p.isActive))
    ) {
      setFormErrors((prev) => ({ ...prev, permissions: "" }));
    }
  };

  const handleSubmit = async () => {
    const currentErrors = { name: "", description: "", permissions: "" };
    let hasError = false;
    if (!formData.name.trim()) {
      currentErrors.name = "Role name is required";
      hasError = true;
    }
    if (!formData.description.trim()) {
      currentErrors.description = "Role description is required";
      hasError = true;
    }
    const hasPermissions = sectionsData.some((section) =>
      section.permissions.some((p) => p.isActive)
    );
    if (!hasPermissions) {
      currentErrors.permissions = "Please select at least one permission";
      hasError = true;
    }

    setFormErrors(currentErrors);
    if (hasError) {
      showToast.error("Please fix the errors in the form.");
      return;
    }

    if (!roleData) {
      showToast.error("Role data is not available.");
      return;
    }

    setLoading(true);
    try {
      const featuresToUpdate = transformSectionsToFeatures(sectionsData);
      const payload: Partial<RoleResponse> = {
        name: formData.name,
        description: formData.description,
        features: featuresToUpdate,
      };

      const response = await updateRole(Number(roleId), payload);

      if (response && response.success !== false) {
        setShowSuccess(true);
        setIsEditing(false);
        await fetchData();
      } else {
        const errorMessage = response?.message || "Failed to update role.";
        showToast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Error updating role:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during update.";
      showToast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (roleData) {
      setFormData({ name: roleData.name, description: roleData.description });
      setSectionsData(transformFeaturesToSections(roleData.features));
      setFormErrors({ name: "", description: "", permissions: "" });
    }
  };

  // Handler for initiating delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Handler for confirming deletion
  const handleDelete = async () => {
    if (!roleData) {
      showToast.error(tMsgs("error_role_data_unavailable"));
      return;
    }
    setLoading(true);
    try {
      const result = await deleteRole(Number(roleId)); // Use deleteRole API
      if (result && result.success !== false) {
        showToast.success(tMsgs("role_deleted_successfully"));
        router.push("/dashboard/admin-management/roles-permissions"); // Redirect to roles list
      } else {
        const errorMessage = result?.message || tMsgs("error_deleting_role");
        setError(errorMessage);
        showToast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error deleting role:", err);
      const errorMsg =
        err instanceof Error ? err.message : tMsgs("error_unexpected");
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setShowDeleteConfirm(false); // Close confirmation popup
      setLoading(false);
    }
  };

  // Handler for canceling deletion
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (loading && !roleData) {
    // Show loading only on initial load
    return <div className="p-4">Loading...</div>;
  }

  if (!roleData) {
    // Should ideally be covered by error state, but as a fallback
    return <div className="p-4">Role not found.</div>;
  }

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("admin-management"), href: "/dashboard/admin-management" },
    {
      label: t("roles-permissions"), // Link back to the list
      href: "/dashboard/admin-management/roles-permissions",
    },
    {
      label: roleData.name, // Show current role name
      href: `/dashboard/admin-management/roles-permissions/${roleId}`, // Current page
    },
  ];

  return (
    <div className="h-full">
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
                disabled={loading} // Disable confirm button while loading
              />
              <Button
                onClick={handleDeleteCancel}
                label={t("buttons.cancel")}
                variant="dark"
                disabled={loading} // Disable cancel button while loading
              />
            </div>
          </div>
        </Popup>
      )}

      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={isEditing ? t("edit_role") : t("view_role")} // Dynamic title
        actions={
          <>
            {!isEditing && ( // Show Edit button only when not editing
              <Button
                label={t("buttons.edit")}
                onClick={() => setIsEditing(true)} // Enter edit mode
                icon={
                  <span className="inline-block w-6">
                    <Edit2 />
                  </span>
                }
                variant="primary"
              />
            )}
            {/* Keep Suspend/Delete buttons - Add their logic later */}
            {/* <Button
              label={t("buttons.suspend")}
              onClick={() => {
              }}
              icon={
                <span className="inline-block w-6">
                  <Suspend />
                </span>
              }
              variant="dark"
              disabled={isEditing}
            /> */}
            <Button
              label={t("buttons.delete")}
              onClick={handleDeleteClick} // Updated onClick handler
              icon={
                <span className="inline-block w-6">
                  <Delete />
                </span>
              }
              variant="danger"
              disabled={isEditing} // Disable while editing
            />
          </>
        }
      />

      {error && <div className="p-4 text-red-500">Error: {error}</div>}
      <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
        {!isEditing && ( // Show role details only when not editing
          <>
            <h1 className="heading3">{t("role_details")}</h1>
            <div className="flex items-center justify-between gap-8 flex-wrap mb-6">
              <GroupInfo
                label={t("name")}
                content={roleData.name}
                copyIt
                icon={<Buildings2 />}
              />
              <GroupInfo
                label={t("description")}
                content={roleData.description}
                icon={<Task />}
              />
              <GroupInfo
                label={t("status")}
                content={<Status status={"1"} />}
                icon={<StatusCheck />}
              />
              {/* <GroupInfo label={t("role")} content={roleData.key} icon={<Task />} /> */}
            </div>
          </>
        )}

        {/* Render PermissionForm always, but control its editability */}
        <PermissionForm
          title={isEditing ? t("edit_role") : undefined} // Show title only when editing
          title2={t("permissions")}
          sections={sectionsData}
          isEditable={isEditing} // Pass editing state
          formData={formData}
          onFormChange={handleFormChange}
          onSectionsChange={handleSectionsChange}
          onSubmit={handleSubmit}
          errors={formErrors}
          onCancel={handleCancelEdit}
        />

        {showSuccess && (
          <SuccessMessage
            title="Successfully Updated"
            msg="Role has been successfully updated"
            bigger
          />
        )}
      </div>
    </div>
  );
}
