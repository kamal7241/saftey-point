"use client";
import { fetchExams } from "@/api/dashboardService";
import Table from "@/components/ui/Table";
import { useRouter } from "@/i18n/routing";
import { SingleExam } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";


const Exams = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [exams, setExams] = useState<SingleExam[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {}
  );

  useEffect(() => {
    const getExams = async () => {
      const response = await fetchExams();
      const data = await response;
      setExams(data);
    };

    getExams();
  }, []);

  const filteredExams = exams.filter((certificate) => {
    const matchesSearch = certificate.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return certificate[key as keyof SingleExam]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  const columns: { header: string; accessor: keyof SingleExam }[] = [
    { header: "exam_id", accessor: "id" },
    { header: "exam_name", accessor: "name" },
    { header: "assigned_to", accessor: "assigned_to" },
    { header: "exam_date", accessor: "exam_date" },
    { header: "score", accessor: "score" },
    { header: "status", accessor: "status" },
  ];

  const totalPages = Math.ceil(filteredExams.length / 10);

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
        ...filteredExams.map((c) => [
          c.id,
          c.name,
          c.status,
          c.assigned_to,
          c.exam_date,
          c.score,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exams.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderRowActions = (row: SingleExam) => (
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
    console.log("Viewing certificate with ID:", id);
    router.push(`/dashboard/user-management/exams/${id}`);

  };
  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("user-management"), href: "/dashboard/user-management" },
    {
      label: t("exams"),
      href: "/dashboard/user-management/exams",
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("exams")}
      />

      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          {/* Search */}
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">

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
          data={filteredExams}
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

    </div>
  );
};

export default Exams;
