"use client";
import { fetchFacilities } from "@/api/presetsService";
import Table from "@/components/ui/Table";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import NewFacilityForm from "../forms/NewFacilityForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Add } from "../ui/icons/Add";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import Popup from "../ui/Popup";

interface Facility {
  id: number;
  title: string;
  titleArabic?: string;
  description: string;
  imageUrl?: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

const Facilities = () => {
  const t = useTranslations("common");
  // const tMsgs = useTranslations("messages");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [createdOptions, setCreatedOptions] = useState<{ value: string; label: string }[]>([]);

  const limit = 10;
  const getFacilities = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;
    const response = await fetchFacilities(offset, limit);
    const data = await response.innerData.facilities;
    if (response.success) {
      setFacilities(
        response.innerData.facilities.map((facility: Facility) => ({
          ...facility,
          name: facility.title,
          image: facility.imageUrl,
          createdAt: format(new Date(facility.createdAt as string), "yyyy / MM / dd"),
          status: facility.deletedAt ? "0" : "1", // Set status based on deletedAt
        }))
      );
      setTotalCount(response.innerData.count);

      const uniqueDates = Array.from(
        new Set(data.map((item: Facility) => item.createdAt))
      );
  
      const formattedDates: { value: string; label: string }[] = [];
      const seenDates = new Set<string>();
      uniqueDates.forEach((date) => {
        const formattedDate = format(new Date(date as string), "yyyy / MM / dd");
        if (!seenDates.has(formattedDate)) {
          formattedDates.push({ value: formattedDate, label: formattedDate });
          seenDates.add(formattedDate);
        }
      });
      setCreatedOptions(formattedDates);
    }
    setLoading(false);
  };

  useEffect(() => {
    getFacilities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch = facility.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return facility[key as keyof Facility]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  const columns: { header: string; accessor: keyof Facility }[] = [
    { header: "name", accessor: "title" },
    { header: "description", accessor: "description" },
    { header: "created", accessor: "createdAt" },
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
          "Description",
          "Created At",
        ],
        ...filteredFacilities.map((c) => [
          c.id,
          c.title,
          c.description,
          c.createdAt,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Facilities.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderRowActions = (row: Facility) => (
    <div className="flex gap-2">
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        href={`/dashboard/presets/facility/${row.id}`}
      />
    </div>
  );

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("presets"), href: "/dashboard/presets" },
    { label: t("facility"), href: "/dashboard/presets/facility" },
  ];

  return (
    <div>
      <PageHeader breadcrumbItems={breadcrumbItems} title={t("facility")} />
      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">
            <Button
              label={t("buttons.add_facility")}
              onClick={() => setAddPopupOpen(true)}
              icon={
                <span className="w-6 inline-block">
                  <Add />
                </span>
              }
              variant="primary"
            />
            <Button
              label={t("buttons.filters")}
              onClick={() => setFiltersOpen((prev) => !prev)}
              variant={!filtersOpen ? "transparent" : "selected"}
            />
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
                label: "Name",
                name: "name",
                placeholder: "Facility Name",
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
          data={filteredFacilities}
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

      <Popup
        isOpen={addPopupOpen}
        onClose={() => {
          setAddPopupOpen(false);
          getFacilities();
        }}
      >
        <NewFacilityForm
          title={t("add_facility")}
          sub_title={t("form_subtitle")}
          onClose={() => {
            setAddPopupOpen(false);
            getFacilities();
          }}
        />
      </Popup>
    </div>
  );
};

export default Facilities;
