"use client";
import React, { useState } from "react";
import Table from "@/components/ui/Table";
import { useTranslations } from "next-intl";
import Button from "../ui/Button";

interface Company {
  id: number;
  name: string;
  location: string;
  status: string;
  branches: number;
  employees: number;
  created: string;
}

const Companies = () => {
  const t = useTranslations("common");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);

  const companies: Company[] = [
    {
      id: 1,
      name: "Company 1",
      location: "New York",
      status: "1",
      branches: 5,
      employees: 120,
      created: "2023-01-01",
    },
    {
      id: 2,
      name: "Company 2",
      location: "Los Angeles",
      status: "0",
      branches: 3,
      employees: 80,
      created: "2022-05-10",
    },
    {
      id: 3,
      name: "Company 3",
      location: "Chicago",
      status: "1",
      branches: 6,
      employees: 150,
      created: "2021-03-23",
    },
  ];

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

  return (
    <div>
      <h1 className="py-1.5 text-2xl capitalize text-gray-700">
        {t("manage_companies")}
      </h1>

      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-3 justify-between items-center">
            {/* Add Company Button */}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setAddPopupOpen(true)}
            >
              Add Company
            </button>

            {/* Filters Button */}
            <Button label="Filters" onClick={() => setFilterPopupOpen(true)} />

            {/* Export Button */}
            <Button label="Export" onClick={handleExport} />
          </div>
        </div>
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
        />
      </div>

      {/* Add Company Popup */}
      {addPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl mb-4">Add Company</h2>
            {/* Add company form */}
            <button
              onClick={() => setAddPopupOpen(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Filter Popup */}
      {filterPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
        </div>
      )}
    </div>
  );
};

export default Companies;
