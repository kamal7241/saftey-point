"use client";
import Table from "@/components/ui/Table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SearchForm from "../formsUI/SearchForm";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import Popup from "../ui/Popup";
import Switcher from "../ui/SmallSwitcher";
import { Add } from "../ui/icons/Add";
import { Delete } from "../ui/icons/Delete";
import { Edit } from "../ui/icons/Edit";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
// import { format } from "date-fns";
import { deleteCompany, fetchCompanies, toggleCompanyVerification } from "@/api/companiesService";
import { Company } from "@/types/ui.types";
import { showToast } from "@/utils/toast";
import NewCompanyForm from "../forms/NewCompanyForm";
import PageHeader from "../global/PageHeader";
import StatsCard from "../ui/StatsCard";
import ClipboardClose from "../ui/icons/ClipboardClose";
import ClipboardTick from "../ui/icons/ClipboardTick";
import CourtHouse from "../ui/icons/CourtHouse";
import TimerEmpty from "../ui/icons/TimerEmpty";
import { UserStatus } from "@/enum/user-status.enum";


const Companies = () => {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
  const [createdOptions, setCreatedOptions] = useState<{ value: string; label: string }[]>([]);

  const limit = 10;
  const getUsers = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;
    const response = await fetchCompanies(offset, limit);
    const data = await response.companies;
    setCompanies(response.companies);
    setTotalCount(response.totalCount);

    const uniqueDates = Array.from(
      new Set(data.map((item: Company) => item.created))
    );

    const formattedDates = uniqueDates.map((date) => {
      const formattedDate = format(new Date(date as string), "yyyy / MM / dd");
      return { value: formattedDate, label: formattedDate };
    });

    setCreatedOptions(formattedDates as { value: string; label: string }[]);
    setLoading(false);
  };
  useEffect(() => {
    getUsers();
  }, [currentPage]);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
  
      const companyValue = company[key as keyof Company];
      if (typeof companyValue === 'string') {
        return companyValue.toLowerCase() === value.toLowerCase(); // Exact match for strings
      }
  
      return companyValue?.toString().toLowerCase() === value.toLowerCase(); // Fallback for other types
    });
  
    return matchesSearch && matchesFilters;
  });
  

  const columns: { header: string; accessor: keyof Company }[] = [
    { header: "company_id", accessor: "id" },
    { header: "name", accessor: "name" },
    { header: "branches", accessor: "branches" },
    { header: "status", accessor: "status" },
    { header: "employees", accessor: "employees" },
    { header: "created", accessor: "created" },
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
        [
          "ID",
          "Name",
          "Location",
          "Status",
          "Branches",
          "Employees",
          "Created",
        ],
        ...filteredCompanies.map((c) => [
          c.id,
          c.name,
          c.location,
          c.status,
          c.branches,
          c.employees,
          c.created,
        ]),
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

  const handleToggleVerification = async (companyId: number, status: string) => {
    try {
      const result = await toggleCompanyVerification(companyId, (status === "ACTIVE") ? "INACTIVE" : "ACTIVE",);
      if (result.success) {

        showToast.success(tMsgs(
          (status === "ACTIVE")
            ? "company_suspended_successfully"
            : "company_activated_successfully"
        ));
        getUsers();
      } else {
        console.error("Failed to toggle verification:", result.error);
      }
    } catch (error) {
      console.error("Error toggling verification:", error);
    }
  };

  const renderRowActions = (row: Company) => (
    <div className="flex gap-2">

      <Switcher
        isChecked={(row.status === "ACTIVE")}
        onChange={() => handleToggleVerification(row.id, row.status.toString())}
      />
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        href={`/dashboard/company-management/companies/${row.id}`}
      />
      <Button
        icon={<Edit />}
        noBackground={true}
        textColor="gray-900"
        noLabel={true}
        href={`/dashboard/company-management/companies/${row.id}`}
      />
      <Button
        icon={<Delete />}
        noBackground={true}
        textColor="red-500"
        noLabel={true}
        onClick={() => {
          setCompanyToDelete(row.id);
          setShowDeleteConfirm(true);
        }}
      />
    </div>
  );

  const handleDelete = async () => {
    if (!companyToDelete) return;

    try {
      const result = await deleteCompany(companyToDelete);
      if (result.success) {
        showToast.success(tMsgs('company_deleted_successfully'));
        await getUsers();
      } else {
        console.error("Failed to delete company:", result.error);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
    setShowDeleteConfirm(false);
    setCompanyToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setCompanyToDelete(null);
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("company-management"), href: "/dashboard/company-management" },
    { label: t("manage-companies"), href: "/dashboard/company-management/companies" },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("manage-companies")}
      />

      {showDeleteConfirm && (
        <Popup isOpen={showDeleteConfirm} onClose={handleDeleteCancel}>
          <div>
            <p className="p-5 text-center text-2xl">
              {t("are_you_sure_delete")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleDelete} label={t("buttons.confirm")} />
              <Button
                onClick={handleDeleteCancel}
                label={t("buttons.cancel")}
                variant="dark"
              />
            </div>
          </div>
        </Popup>
      )}

      {/* Stats Cards */}
      <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <StatsCard
          icon={<CourtHouse />}
          color="brand"
          number={totalCount}
          name={t("total_companies")}
        />
        <StatsCard
          icon={<ClipboardTick />}
          color="success"
          number={companies.filter(c => c.status==="ACTIVE").length}
          name={t("approved_companies")}
        />
        <StatsCard
          icon={<TimerEmpty />}
          color="warning"
          number={companies.filter(c => c.status==="SUSPENDED").length}
          name={t("suspended_companies")}
        />
        <StatsCard
          icon={<ClipboardClose />}
          color="red"
          number={companies.filter(c => c.status === "INACTIVE").length}
          name={t("inactive_companies")}
        />
      </div>
      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          {/* Search */}
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">
            <Button
              label={t("buttons.add_company")}
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
                  { value: UserStatus.ACTIVE, label: t("user_status.active") },
                  { value: UserStatus.INACTIVE, label: t("user_status.inactive") },
                  { value: UserStatus.PENDING, label: t("user_status.pending") },
                  { value: UserStatus.EXPIRED, label: t("user_status.expired") },
                ],
              },
              {
                type: "select",
                label: "Created",
                placeholder: "Created",
                name: "createdAt",
                options: createdOptions,
              },
            ]}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
        <Table
          data={filteredCompanies}
          columns={columns}
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalCount / limit),
            onPageChange: (page) => setCurrentPage(page),

          }}

          rowsPerPage={limit}
          renderRowActions={renderRowActions}
          isLoading={loading}
        />
      </div>

      <Popup isOpen={addPopupOpen} onClose={() => {
        setAddPopupOpen(false);
        getUsers();
      }}>
        <NewCompanyForm
          title={t("add_company")}
          sub_title={t("add_company_subtitle")}
          onClose={() => {
            setAddPopupOpen(false);
            getUsers();
          }}
        />
      </Popup>
    </div>
  );
};

export default Companies;
