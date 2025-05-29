"use client";
import { fetchStaffManagement, updateStaffStatus, deleteStaff } from "@/api/staffService";
import Table from "@/components/ui/Table";
import { SingleStaffUI } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import NewStaffForm from "../forms/NewStaffForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Add } from "../ui/icons/Add";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import Popup from "../ui/Popup";
import { Edit } from "../ui/icons/Edit";
import { Delete } from "../ui/icons/Delete";
import { AdminStatus } from "@/enum/admin-status.enum";
import Toggler from "../formsUI/Toggler";
import { showToast } from "@/utils/toast";
import { useRouter } from "next/navigation";


const StaffManagement = () => {
  const t = useTranslations("common");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [staffManagement, setStaffManagement] = useState<SingleStaffUI[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>({});
  const limit = 10;
  const router = useRouter();

  const getStaffManagement = async () => {
    const offset = (currentPage - 1) * limit;
    const response = await fetchStaffManagement(offset, limit);
    const data = await response;
    setStaffManagement(data.users);
    setTotalCount(response.totalCount);
  };
  useEffect(() => {
    getStaffManagement();
  }, [currentPage]);

  const filteredStaffManagement = staffManagement.filter((staff: SingleStaffUI) => {
    const matchesSearch = staff.name ?? ""
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;

      const companyValue = staff[key as keyof SingleStaffUI];
      if (typeof companyValue === 'string') {
        return companyValue.toLowerCase() === value.toLowerCase();
      }

      return companyValue?.toString().toLowerCase() === value.toLowerCase();
    });

    return matchesSearch && matchesFilters;
  });

  const columns: { header: string; accessor: keyof SingleStaffUI }[] = [
    { header: "users_id", accessor: "id" },
    { header: "name", accessor: "name" },
    { header: "email", accessor: "email" },
    { header: "phone", accessor: "phone" },
    { header: "role", accessor: "type" },
    { header: "status", accessor: "status" },
  ];

  const handleApplyFilters = (appliedFilters: { [key: string]: string }) => {
    setFilters(appliedFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };
  const handleClose = async () => {
    setAddPopupOpen(false);
    getStaffManagement();
  };
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "ID",
          "Name",
          "Status",
          "assigned_to",
          "expiry_date",
          "exam_date",
          "score",
        ],
        ...filteredStaffManagement.map((c) => [
          c.id,
          c.name,
          c.email,
          c.phone,
          c.type,
          c.status,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "staffManagement.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleStatus = async (staff: SingleStaffUI, isActive: boolean) => {
    const newStatus = isActive ? AdminStatus.ACTIVE : AdminStatus.SUSPENDED;
    try {
      const result = await updateStaffStatus(staff.id, newStatus);
      if (result.success) {
        await getStaffManagement();
      } else {
        // يمكنك إضافة showToast للخطأ هنا
      }
    } catch (error) {
      console.error("Error updating staff status:", error);
    }
  };
  const handleEdit = (id: number) => {
    // انتقل لصفحة التعديل أو افتح popup التعديل
    // مثال:
    router.push(`/dashboard/staff-management/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteStaff(id);
      if (result.success) {
        showToast.success("Staff deleted successfully");
        await getStaffManagement();
      } else {
        showToast.error(result.error || "Failed to delete staff");
      }
    } catch (error) {
      showToast.error("An unexpected error occurred");
      console.error("Error deleting staff:", error);
    }
  };

  const renderRowActions = (row: SingleStaffUI) => (
    <div className="flex gap-2 items-center">
      <Toggler
        checked={row.status === "ACTIVE"}
        onChange={() => handleToggleStatus(row, row.status !== "ACTIVE")}
      />
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        href={`/dashboard/staff-management/${row.id}`}
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
        onClick={() => handleDelete(row.id)}
      />
    </div>
  );

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    {
      label: t("staff-management"),
      href: "/dashboard/staff-management",
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("staff-management")}
      />

      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          {/* Search */}
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">

            <Button
              label={t("buttons.add_staff")}
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
                label: t("user_id"),
                name: "id",
                placeholder: t("user_id"),
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
                  { value: "ACTIVE", label: t("user_status.active") },
                  { value: "INACTIVE", label: t("user_status.inactive") },
                  { value: "PENDING", label: t("user_status.pending") },
                  { value: "EXPIRED", label: t("user_status.expired") },
                ],
              },
              {
                type: "select",
                label: t("role"),
                placeholder: t("role"),
                name: "type",
                options: [
                  { value: "admin", label: t("user_role.admin") },
                  { value: "company", label: t("user_role.company") },
                  { value: "staff", label: t("user_role.staff") },
                  { value: "user", label: t("user_role.user") },
                ],
              }
            ]}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
        <Table
          data={filteredStaffManagement}
          columns={columns}
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalCount / limit),
            onPageChange: (page) => setCurrentPage(page),

          }}

          rowsPerPage={10}
          renderRowActions={renderRowActions}
        />
      </div>

      <Popup isOpen={addPopupOpen} onClose={handleClose}>
        <NewStaffForm
          title={t("add_staff")}
          sub_title={t("form_subtitle")}
          onClose={handleClose}
        />
      </Popup>
    </div>
  );
};

export default StaffManagement;
