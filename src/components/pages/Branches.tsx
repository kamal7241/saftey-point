"use client";
import { deleteBranch, fetchBranches } from "@/api/companiesService";
import Table from "@/components/ui/Table";
import { Branch } from "@/types/ui.types";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import NewBranchForm from "../forms/NewBranchForm";
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
import { showToast } from "@/utils/toast";


const Branches = () => {
  const t = useTranslations("common");
  const tMsgs = useTranslations("messages");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<number | null>(null);
  const [createdOptions, setCreatedOptions] = useState<{ value: string; label: string }[]>([]);

  const getBranches = async () => {
    const response = await fetchBranches();
    const data = await response.branches;
    setBranches(data);

    const uniqueDates = Array.from(
      new Set(data.map((item: Branch) => item.createdAt))
    );

    const formattedDates = uniqueDates.map((date) => {
      const formattedDate = format(new Date(date as string), "yyyy / MM / dd");
      return { value: date, label: formattedDate };
    });

    setCreatedOptions(formattedDates as { value: string; label: string }[]);
  };

  useEffect(() => {
    getBranches();
  }, []);

  const filteredBranches = branches.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return item[key as keyof Branch]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  const columns: { header: string; accessor: keyof Branch }[] = [
    { header: "branch_name", accessor: "name" },
    { header: "address", accessor: "address" },
    { header: "created", accessor: "createdAt" },
    { header: "status", accessor: "status" },
  ];

  const totalPages = Math.ceil(filteredBranches.length / 10);

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
          "Address",
          "Status",
          "Created At",
          "Latitude",
          "Longitude"
        ],
        ...filteredBranches.map((c) => [
          c.id,
          c.name,
          c.address,
          c.status,
          c.createdAt,
          c.latitude,
          c.longitude
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

  const renderRowActions = (row: Branch) => (
    <div className="flex gap-2">
      {/* <Switcher /> */}
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        href={`/dashboard/company-management/branches/${row.id}`}
      />
      <Button
        icon={<Edit />}
        noBackground={true}
        textColor="gray-900"
        noLabel={true}
        href={`/dashboard/company-management/branches/${row.id}`}
      />
      <Button
        icon={<Delete />}
        noBackground={true}
        textColor="red-500"
        noLabel={true}
        // onClick={() => handleDelete(row.id)}
        onClick={() => {
          setBranchToDelete(row.id);
          setShowDeleteConfirm(true);
        }}
      />
    </div>
  );

  const handleDelete = async () => {
    if (!branchToDelete) return;

    try {
      const result = await deleteBranch(branchToDelete);
      if (result.success) {
        showToast.success(tMsgs('company_deleted_successfully'));
        await getBranches();
      } else {
        console.error("Failed to delete company:", result.error);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
    setShowDeleteConfirm(false);
    setBranchToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setBranchToDelete(null);
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("company-management"), href: "/dashboard/company-management/companies" },
    { label: t("manage-branches"), href: "/dashboard/company-management/branches" },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("manage-branches")}
      />

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
      {/* Table */}
      <div className="mt-6 rounded-2xl bg-white">
        <div className="flex flex-wrap-reverse items-center justify-between gap-6 p-4">
          {/* Search */}
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex flex-wrap items-stretch justify-between gap-3">
            <Button
              label={t("buttons.add_branch")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="inline-block w-6">
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
                <span className="inline-block w-6">
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
                label: "Name",
                name: "name",
                placeholder: "Branch Name",
              },
              {
                type: "text",
                label: "location",
                name: "location_name",
                placeholder: "Location",
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
                options: createdOptions,
              },
            ]}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
        <Table
          data={filteredBranches.map(branch => ({ ...branch, image: undefined }))}
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

      <Popup isOpen={addPopupOpen}
        onClose={() => {
          setAddPopupOpen(false);
          getBranches();
        }}
      >
        <NewBranchForm
          title={t("add_branch")}
          sub_title={t("add_branch_subtitle")}
          onClose={() => {
            setAddPopupOpen(false);
            getBranches();
          }}
        />
      </Popup>
    </div>
  );
};

export default Branches;
