"use client";
import { fetchCertificates } from "@/api/certificatesService";
import Table from "@/components/ui/Table";
import { SingleCertificate } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import NewCertificateForm from "../forms/NewCertificateForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Add } from "../ui/icons/Add";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import Popup from "../ui/Popup";

const Certificates = () => {
  const t = useTranslations("common");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [certificates, setCertificates] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // const [certificateToDelete, setCertificateToDelete] = useState<number | null>(null);

  const limit = 10;

  const getCertificates = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;
    const response = await fetchCertificates(offset, limit);
    setCertificates(response.certificates);
    setTotalCount(response.totalCount);
    setLoading(false);
  };

  useEffect(() => {
    getCertificates();
  }, [currentPage]);

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = cert.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return cert[key]?.toString().toLowerCase().includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: any = [
    { header: "id", accessor: "id" },
    { header: "name", accessor: "title" },
    { header: "issue_date", accessor: "issueDate" },
    { header: "validFrom", accessor: "validFrom" },
    { header: "validTo", accessor: "validTo" },
    { header: "course_id", accessor: "courseId" },
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
        ["ID", "Title", "Issue Date", "Valid From", "Valid To", "Course ID"],
        ...filteredCertificates.map((c) => [
          c.id,
          c.title,
          c.issueDate,
          c.validFrom,
          c.validTo,
          c.courseId,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "certificates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderRowActions = (row: SingleCertificate) => (
    <div className="flex gap-2">
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        href={`/dashboard/user-management/certificates/${row.id}`}
      />
    </div>
  );

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("user-management"), href: "/dashboard/user-management" },
    {
      label: t("certificates"),
      href: "/dashboard/user-management/certificates",
    },
  ];

  return (
    <div>
      <PageHeader breadcrumbItems={breadcrumbItems} title={t("certificates")} />

      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          {/* Search */}
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">
            <Button
              label={t("buttons.add_certificate")}
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
                label: t("certificate_id"),
                name: "id",
                placeholder: t("certificate_id"),
              },
              {
                type: "text",
                label: t("name"),
                name: "title",
                placeholder: t("name"),
              },
              {
                type: "text",
                label: t("course_id"),
                name: "courseId",
                placeholder: t("course_id"),
              },
              // {
              //   type: "select",
              //   label: "Created",
              //   placeholder: "Created",
              //   name: "created",
              //   options: [],
              // },
            ]}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
        <Table
          data={
            filteredCertificates as (SingleCertificate & {
              image?: undefined;
            })[]
          }
          columns={columns}
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalCount / limit),
            onPageChange: (page) => setCurrentPage(page),
          }}
          rowsPerPage={10}
          renderRowActions={renderRowActions}
          isLoading={loading}
          // sortable
        />
      </div>

      <Popup
        isOpen={addPopupOpen}
        onClose={() => {
          setAddPopupOpen(false);
          getCertificates();
        }}
      >
        <NewCertificateForm
          title={t("buttons.add_certificate")}
          sub_title={t("form_subtitle")}
          onClose={() => {
            setAddPopupOpen(false);
            getCertificates();
          }}
        />
      </Popup>
    </div>
  );
};

export default Certificates;
