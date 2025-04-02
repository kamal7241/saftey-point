"use client";
import React, { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import { useTranslations } from "next-intl";
import Button from "../ui/Button";
import { Add } from "../ui/icons/Add";
import { Export } from "../ui/icons/Export";
import Popup from "../ui/Popup";
import Eye from "../ui/icons/Eye";
import { Edit } from "../ui/icons/Edit";
import { Delete } from "../ui/icons/Delete";
import SearchForm from "../formsUI/SearchForm";
import Switcher from "../ui/SmallSwitcher";
import FilterForm from "../ui/FilterForm";
// import { format } from "date-fns";
import NewCompanyForm from "../forms/NewCompanyForm";
import PageHeader from "../global/PageHeader";
import { useRouter } from "@/i18n/routing";
import { Company } from "@/types/ui.types";
import { fetchCompanies } from "@/api/companiesService";


const Companies = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>({});

  const limit = 10;
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const offset = (currentPage - 1) * limit;
      const response = await fetchCompanies(offset, limit);
      setCompanies(response.companies);
      setTotalCount(response.totalCount);
      setLoading(false);
    };

    getUsers();
  }, [currentPage]);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true; // Ignore empty filter fields
      return company[key as keyof Company]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
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

  const renderRowActions = (row: Company) => (
    <div className="flex gap-2">
      <Switcher />
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
        onClick={() => handleDelete(row.id)}
      />
    </div>
  );

  const handleView = (id: number) => {
    console.log("Viewing company with ID:", id);
    router.push(`/dashboard/company-management/companies/${id}`);

  };

  const handleEdit = (id: number) => {
    console.log("Editing company with ID:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Deleting company with ID:", id);
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("company-management"), href: "/company-management" },
    {
      label: t("manage-companies"),
      href: "/company-management/manage-companies",
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("manage-companies")}
      />

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
                  { value: "1", label: "Active" },
                  { value: "0", label: "Inactive" },
                ],
              },
              // {
              //   type: "select",
              //   label: "Created",
              //   placeholder: "Created",
              //   name: "created",
              //   options: createdOptions,
              // },
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
          sortable={true}
          rowsPerPage={limit}
          renderRowActions={renderRowActions}
          isLoading={loading}
        />
      </div>

      <Popup isOpen={addPopupOpen} onClose={() => setAddPopupOpen(false)}>
        <NewCompanyForm
          title={t("add_company")}
          sub_title={t("add_company_subtitle")}
          onClose={() => setAddPopupOpen(false)}
        />
      </Popup>
    </div>
  );
};

export default Companies;
