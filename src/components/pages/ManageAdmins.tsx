"use client";
import { fetchAdmins, deleteAdmin } from "@/api/adminService";
import Table from "@/components/ui/Table";
import { useRouter } from "@/i18n/routing";
import { Admin } from "@/types/ui.types";
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
import { AdminStatus } from "@/enum/admin-status.enum";

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
    const response = await fetchAdmins(offset, limit);
    if ("admins" in response) {
      setAdmins(response.admins);
      setTotalCount(response.totalCount);
    } else {
      showToast.error(tMsgs("error_fetching_admins"));
    }
    setLoading(false);
  };

  useEffect(() => {
    getAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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

  const columns: { header: string; accessor: keyof Admin }[] = [
    { header: "user_id", accessor: "id" },
    { header: "name", accessor: "name" },
    { header: "email", accessor: "email" },
    { header: "phone_number", accessor: "phone" },

    { header: "status", accessor: "status" },
  ];
  const handleApplyFilters = (appliedFilters: { [key: string]: string }) => {
    setFilters(appliedFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
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
    link.setAttribute("download", "companies.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setAddPopupOpen(false);
    window.location.reload();
  };

  const renderRowActions = (row: Admin) => (
    <div className="flex gap-2">
      {/* <Switcher /> */}
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
          <SearchForm onSearch={setSearchTerm} />
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
                  { value: AdminStatus.ACTIVE, label: t("active") },
                  { value: AdminStatus.SUSPENDED, label: t("suspended") },
                ],
              },
            ]}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
        <Table
          data={filteredAdmins}
          columns={columns}
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalCount / limit),
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
        />
      </Popup>
    </div>
  );
};

export default ManageAdmins;
