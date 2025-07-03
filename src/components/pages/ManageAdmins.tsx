"use client";
import { fetchAdmins, deleteAdmin, updateAdminStatus } from "@/api/adminService";
import Table from "@/components/ui/Table";
import { useRouter } from "@/i18n/routing";
import { Admin, AdminResponse } from "@/types/ui.types";
import { showToast } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import NewAdminForm from "../forms/NewAdminForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Add } from "../ui/icons/Add";
import { Delete } from "../ui/icons/Delete";
import { Edit } from "../ui/icons/Edit";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import Popup from "../ui/Popup";
import Toggler from "../formsUI/Toggler";
import { UserStatus } from "@/enum/user-status.enum";
import { debounce } from "lodash";

const ManageAdmins = () => {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);

  const limit = 10;
  const getAdmins = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;
    const response = await fetchAdmins(offset, limit, searchTerm);

    if ("admins" in response) {
      setAdmins(
        response.admins.map((admin: AdminResponse) => ({
          id: admin.id,
          name: `${admin.user.firstName} ${admin.user.lastName}`,
          email: admin.user.email,
          status: admin.status,
          type: admin.userType,
          phone: admin.user.phone,
          image: admin.user.avatar.startsWith("http")
            ? admin.user.avatar
            : `${process.env.NEXT_PUBLIC_URL}${admin.user.avatar}`,
          isVerified: admin.user.isVerified,
          permissions:
            admin.rolePermissions?.map((p) => (p.name)) || [],
          role:
            admin.roles && admin.roles.length > 0 ? admin.roles[0].name : "N/A",
          userType: admin.userType,
          user: admin.user,
        }))
      );
      setTotalCount(response.totalCount);
    } else {
      showToast.error(tMsgs("error_fetching_admins"));
    }
    setLoading(false);
  };

  useEffect(() => {
    getAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = admin.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return admin[key as keyof Admin]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  // Check if any filters are active (not empty/undefined)
  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value.trim() !== ""
  );

  // Conditional pagination logic
  const tableData = hasActiveFilters
    ? filteredAdmins.slice((currentPage - 1) * limit, currentPage * limit) // Client-side pagination
    : filteredAdmins; // Server-side pagination

  const totalPages = hasActiveFilters
    ? Math.ceil(filteredAdmins.length / limit) // Client-side total pages
    : Math.ceil(totalCount / limit); // Server-side total pages

  const columns: { header: string; accessor: keyof Admin }[] = [
    { header: "user_id", accessor: "id" },
    { header: "name", accessor: "name" },
    { header: "role", accessor: "role" },
    { header: "email", accessor: "email" },
    { header: "phone_number", accessor: "phone" },
    { header: "permissions", accessor: "permissions" },
    { header: "status", accessor: "status" },
  ];
  const handleApplyFilters = (appliedFilters: { [key: string]: string }) => {
    setFilters(appliedFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["ID", "Name", "Status"],
        ...filteredAdmins.map((c) => [c.id, c.name, c.status]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admins.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setAddPopupOpen(false);
    window.location.reload();
  };

  const handleToggleStatus = async (admin: Admin) => {
    const newStatus =
      admin.status === UserStatus.ACTIVE
        ? UserStatus.INACTIVE
        : UserStatus.ACTIVE;
    try {
      const result = await updateAdminStatus(admin.id, newStatus);
      if (result.success) {
        showToast.success(
          newStatus === UserStatus.ACTIVE
            ? tMsgs("admin_activated_successfully")
            : tMsgs("admin_suspended_successfully")
        );
        await getAdmins();
      } else {
        showToast.error(result.error || tMsgs("error_updating_admin_status"));
      }
    } catch (error) {
      showToast.error(tMsgs("error_updating_admin_status"));
      console.error("Error updating admin status:", error);
    }
  };

  const renderRowActions = (row: Admin) => (
    <div className="flex gap-2 items-center">
      <Toggler
        checked={row.status === UserStatus.ACTIVE}
        onChange={() => handleToggleStatus(row)}
      />
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        onClick={() => handleView(row.id)}
      />
      <Button
        icon={<Edit />}
        noBackground={true}
        textColor="gray-900"
        noLabel={true}
        onClick={() => handleEdit(row.id)}
      />
      <Button
        icon={<Delete />}
        noBackground={true}
        textColor="red-500"
        noLabel={true}
        onClick={() => {
          setAdminToDelete(row.id);
          setShowDeleteConfirm(true);
        }}
      />
    </div>
  );

  const handleView = (id: number) => {
    router.push(`/dashboard/admin-management/manage-admins/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/admin-management/manage-admins/${id}`);
  };

  const handleDelete = async () => {
    if (!adminToDelete) return;

    try {
      const result = await deleteAdmin(adminToDelete);
      if (result.success) {
        showToast.success(tMsgs("admin_deleted_successfully"));
        await getAdmins();
      } else {
        showToast.error(result.error || tMsgs("error_deleting_admin"));
        console.error("Failed to delete admin:", result.error);
      }
    } catch (error) {
      showToast.error(tMsgs("error_deleting_admin"));
      console.error("Error deleting admin:", error);
    }
    setShowDeleteConfirm(false);
    setAdminToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setAdminToDelete(null);
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("admin-management"), href: "/dashboard/admin-management" },
    {
      label: t("manage-admins"),
      href: "/dashboard/admin-management/manage-companies",
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("manage-admins")}
      />

      {/* Add Delete Confirmation Popup */}
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

      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          {/* Search */}
          <SearchForm onSearch={debounce(setSearchTerm, 500)} />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">
            <Button
              label={t("buttons.add_admin")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="w-6 inline-block">
                  <Add />
                </span>
              }
              variant="primary"
            />

            {/* Filters Button */}
            <Button
              className="hidden"
              label={t("buttons.filters")}
              onClick={() => setFiltersOpen((prev) => !prev)}
              variant={!filtersOpen ? "transparent" : "selected"}
            />

            {/* Export Button */}
            <Button
              label={t("buttons.export")}
              onClick={handleExport}
              variant="dark"
              icon={
                <span className="w-6 inline-block">
                  <Export />
                </span>
              }
            />
          </div>
        </div>

        {filtersOpen && (
          <FilterForm
            fields={[
              {
                type: "text",
                label: t("admin_id"),
                name: "id",
                placeholder: t("admin_id"),
              },
              {
                type: "text",
                label: t("name"),
                name: "name",
                placeholder: t("name"),
              },
              {
                type: "select",
                label: t("status"),
                placeholder: t("status"),
                name: "status",
                options: [
                  { value: UserStatus.ACTIVE, label: t("user_status.active") },
                  {
                    value: UserStatus.INACTIVE,
                    label: t("user_status.inactive"),
                  },
                  {
                    value: UserStatus.PENDING,
                    label: t("user_status.pending"),
                  },
                  {
                    value: UserStatus.EXPIRED,
                    label: t("user_status.expired"),
                  },
                ],
              },
            ]}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
        <Table
          data={tableData}
          columns={columns}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
          }}
          rowsPerPage={limit}
          renderRowActions={renderRowActions}
          isLoading={loading}
        />
      </div>

      <Popup isOpen={addPopupOpen} onClose={handleClose}>
        <NewAdminForm
          title={t("add_admin")}
          sub_title={t("form_subtitle")}
          onClose={handleClose}
          fieldsStatus={{
            status: {
              readOnly: true,
            }
          }}
        />
      </Popup>
    </div>
  );
};

export default ManageAdmins;
