"use client";
import { fetchStaffManagement, deleteStaff } from "@/api/staffService";
import Table from "@/components/ui/Table";
import { SingleStaffUI } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import NewStaffForm from "../forms/NewStaffForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import { showToast } from "@/utils/toast";

import { Add } from "../ui/icons/Add";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import { Edit } from "../ui/icons/Edit";
import { Delete } from "../ui/icons/Delete";
import Popup from "../ui/Popup";


const StaffManagement = () => {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<number | null>(null);

  const [staffManagement, setStaffManagement] = useState<SingleStaffUI[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  const getStaffManagement = async () => {
    const offset = (currentPage - 1) * limit;
    const response = await fetchStaffManagement(offset, limit, searchTerm);
    const data = await response;
    setStaffManagement(data.users);
    setTotalCount(response.totalCount);
  };
  useEffect(() => {
    getStaffManagement();
  }, [currentPage, searchTerm]);

  const columns: { header: string; accessor: keyof SingleStaffUI }[] = [
    { header: "users_id", accessor: "id" },
    { header: "name", accessor: "name" },
    { header: "email", accessor: "email" },
    { header: "phone", accessor: "phone" },
    { header: "role", accessor: "roleName" },
    { header: "status", accessor: "status" },
  ];


  const handleClose = async () => {
    setAddPopupOpen(false);
    getStaffManagement();
  };

  const handleDelete = async () => {
    if (!staffToDelete) return;

    try {
      const result = await deleteStaff(staffToDelete);
      if (result.success) {
        showToast.success(tMsgs("staff_deleted_successfully") || "Staff deleted successfully");
        await getStaffManagement();
      } else {
        showToast.error(result.error || tMsgs("error_deleting_staff") || "Error deleting staff");
        console.error("Failed to delete staff:", result.error);
      }
    } catch (error) {
      showToast.error(tMsgs("error_deleting_staff") || "Error deleting staff");
      console.error("Error deleting staff:", error);
    }
    setShowDeleteConfirm(false);
    setStaffToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setStaffToDelete(null);
  };

  const handleView = (id: number, staffId?: number) => {
    // Use staff ID for navigation since the API expects staff ID
    const navigationId = staffId || id;
    router.push(`/dashboard/staff-management/${navigationId}`);
  };

  const handleEdit = (id: number, staffId?: number) => {
    // Use staff ID for navigation since the API expects staff ID
    const navigationId = staffId || id;
    router.push(`/dashboard/staff-management/${navigationId}`);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "ID",
          "Name",
          "Email",
          "Phone",
          "Role",
          "Role Description",
          "Status",
        ],
        ...staffManagement.map((c) => [
          c.id,
          c.name,
          c.email,
          c.phone,
          c.roleName,
          c.roleDescription,
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

  const renderRowActions = (row: SingleStaffUI) => (
    <div className="flex gap-2">
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        onClick={() => handleView(row.id, row.staffId)}
      />
      <Button
        icon={<Edit />}
        noBackground={true}
        textColor="gray-900"
        noLabel={true}
        onClick={() => handleEdit(row.id, row.staffId)}
      />
      <Button
        icon={<Delete />}
        noBackground={true}
        textColor="red-500"
        noLabel={true}
        onClick={() => {
          setStaffToDelete(row.staffId || row.id);
          setShowDeleteConfirm(true);
        }}
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
              label={t("buttons.add_staff")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="w-6 inline-block">
                  <Add />
                </span>
              }
              variant="primary"
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

        <Table
          data={staffManagement}
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
