"use client";
import { fetchStaffManagement } from "@/api/staffService";
import Table from "@/components/ui/Table";
import { SingleStaffUI } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import NewStaffForm from "../forms/NewStaffForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";

import { Add } from "../ui/icons/Add";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import Popup from "../ui/Popup";


const StaffManagement = () => {
  const t = useTranslations("common");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [addPopupOpen, setAddPopupOpen] = useState(false);

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
    { header: "role", accessor: "type" },
    { header: "status", accessor: "status" },
  ];


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
        ...staffManagement.map((c) => [
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

  const renderRowActions = (row: SingleStaffUI) => (
    <div className="flex gap-2">
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        href={`/dashboard/staff-management/${row.id}`}
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
