"use client";
import { fetchStaffManagement } from "@/api/dashboardService";
import Table from "@/components/ui/Table";
import { useRouter } from "@/i18n/routing";
import { SingleStaff } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import { Add } from "../ui/icons/Add";
import Popup from "../ui/Popup";
import NewStaffForm from "../forms/NewStaffForm";


const StaffManagement = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [staffManagement, setStaffManagement] = useState<SingleStaff[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {}
  );

  useEffect(() => {
    const getStaffManagement = async () => {
      const response = await fetchStaffManagement();
      const data = await response;
      setStaffManagement(data);
    };

    getStaffManagement();
  }, []);

  const filteredStaffManagement = staffManagement.filter((certificate) => {
    const matchesSearch = certificate.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return certificate[key as keyof SingleStaff]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  const columns: { header: string; accessor: keyof SingleStaff }[] = [
    { header: "users_id", accessor: "id" },
    { header: "name", accessor: "name" },
    { header: "email", accessor: "email" },
    { header: "phone", accessor: "phone" },
    { header: "role", accessor: "role" },
    { header: "status", accessor: "status" },
  ];

  const totalPages = Math.ceil(filteredStaffManagement.length / 10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
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
          c.role,
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

  const renderRowActions = (row: SingleStaff) => (
    <div className="flex gap-2">
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        onClick={() => handleView(row.id)}
      />
    </div>
  );

  const handleView = (id: number) => {
    router.push(`/dashboard/user-management/staffManagement/${id}`);

  };
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
                label: "Company ID",
                name: "id",
                placeholder: "Company ID",
              },
              {
                type: "text",
                label: "Name",
                name: "name",
                placeholder: "Name",
              },
              {
                type: "select",
                label: "Status",
                placeholder: "Status",
                name: "status",
                options: [
                  { value: "1", label: "Active" },
                  { value: "0", label: "Inactive" },
                ],
              },
              {
                type: "select",
                label: "Created",
                placeholder: "Created",
                name: "created",
                options: [],
              },
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
            totalPages,
            onPageChange: handlePageChange,
          }}
          sortable={true}
          rowsPerPage={10}
          renderRowActions={renderRowActions}
        />
      </div>

      <Popup isOpen={addPopupOpen} onClose={() => setAddPopupOpen(false)}>
        <NewStaffForm
          title={t("add_staff")}
          sub_title={t("form_subtitle")}
          onClose={() => setAddPopupOpen(false)}
        />
      </Popup>
    </div>
  );
};

export default StaffManagement;
