/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { fetchExams } from "@/api/presetsService";
import Table from "@/components/ui/Table";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>({});

  const limit = 10;
  const getExams = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;
    const response = await fetchExams(offset, limit);
    if (response.success) {
      setExams(
        response.innerData.items.map((exam: any) => ({
          ...exam,
          createdAt: new Date(exam.createdAt).toDateString(),
          examType: exam.examType.toLowerCase(),
          status: exam.status === "ACTIVE" ? "1" : "0"
        }))
      );
      setTotalCount(response.innerData.count);
    }
    setLoading(false);
  };

  useEffect(() => {
    getExams();
  }, [currentPage]);

  const filteredExams = exams.filter((certificate) => {
    const matchesSearch = certificate.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return certificate[key as keyof any]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  const columns: { header: string; accessor: keyof any }[] = [
    { header: "exam_id", accessor: "id" },
    { header: "exam_name", accessor: "title" },
    { header: "examType", accessor: "examType" },
    { header: "exam_date", accessor: "createdAt" },
    { header: "totalMarks", accessor: "totalMarks" },
    { header: "passMarks", accessor: "passMarks" },
    { header: "duration", accessor: "duration" },
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
          "Exam Type",
          "Created At",
          "Total Marks",
          "Pass Marks",
          "Duration",
          "Status",
        ],
        ...filteredExams.map((exam) => [
          exam.id,
          exam.title,
          exam.examType,
          exam.createdAt,
          exam.totalMarks,
          exam.passMarks,
          exam.duration,
          exam.status === "1" ? t("active") : t("inactive") 
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

  const renderRowActions = (row: any) => (
    <div className="flex gap-2">
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        href={`/dashboard/user-management/exams/${row.id}`}
      />
    </div>
  );

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("user-management"), href: "/dashboard/user-management" },
    { label: t("exams"), href: "/dashboard/user-management/exams" },
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
                label: t('examId'),
                name: "id",
                placeholder: t('examId'),
              },
              {
                type: "text",
                label: t('examName'),
                name: "title",
                placeholder: t('examName'),
              },
              {
                type: "text",
                label: t('examType'),
                name: "examType",
                placeholder: t('examType'),
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
            totalPages: Math.ceil(totalCount / limit),
            onPageChange: (page) => setCurrentPage(page),
          }}

          rowsPerPage={limit}
          renderRowActions={renderRowActions}
          isLoading={loading}
        />
      </div>

    </div>
  );
};

export default Exams;
