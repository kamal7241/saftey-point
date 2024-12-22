"use client";
import React, { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import { useTranslations } from "next-intl";
import Button from "../ui/Button";
import Breadcrumb from "../global/ui/Breadcrumb";
import { Add } from "../ui/icons/Add";
import { Export } from "../ui/icons/Export";
import Popup from "../ui/Popup";
import Eye from "../ui/icons/Eye";
import { Edit } from "../ui/icons/Edit";
import { Delete } from "../ui/icons/Delete";
import SearchForm from "../forms/SearchForm";
import { fetchCompanies } from "@/api/dashboardService";

interface Company {
  id: number;
  name: string;
  location: string;
  status: string;
  branches: number;
  employees: number;
  created: string;
  image?: string;
}

const Companies = () => {
  const t = useTranslations("common");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const getCompanies = async () => {
      const response = await fetchCompanies();
      const data = await response;
      setCompanies(data);
    };

    getCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: { header: string; accessor: keyof Company }[] = [
    { header: "company_id", accessor: "id" },
    { header: "name", accessor: "name" },
    { header: "branches", accessor: "branches" },
    { header: "status", accessor: "status" },
    { header: "employees", accessor: "employees" },
    { header: "created", accessor: "created" },
  ];

  const totalPages = Math.ceil(filteredCompanies.length / 5);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <h1 className="py-1.5 text-2xl capitalize text-gray-700">
        {t("manage-companies")}
      </h1>
      <Breadcrumb items={breadcrumbItems} />

      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4">
          {/* Search */}
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex gap-3 justify-between items-center">
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
              onClick={() => setFilterPopupOpen(true)}
              variant="transparent"
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

        {filterPopupOpen && (
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl mb-4">Filters</h2>
            {/* Filter form */}
            <button
              onClick={() => setFilterPopupOpen(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        )}
        <Table
          data={filteredCompanies}
          columns={columns}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange,
          }}
          sortable={true}
          rowsPerPage={5}
          renderRowActions={renderRowActions}
        />
      </div>

      <Popup
        isOpen={addPopupOpen}
        onClose={() => setAddPopupOpen(false)}
        title="Add New Company"
      >
        <form>
          <label>Company Name</label>
          <input type="text" className="border rounded-lg w-full p-2 mb-4" />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add Company
          </button>
        </form>
      </Popup>
    </div>
  );
};

export default Companies;
