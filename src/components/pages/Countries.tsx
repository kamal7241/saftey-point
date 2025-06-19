"use client";
import { fetchCountries } from "@/api/countryService";
import Table from "@/components/ui/Table";
import { Country } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePageLoading } from "@/hooks/usePageLoading";
import NewCountryForm from "../forms/NewCountryForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import Popup from "../ui/Popup";

const Countries = () => {
  const t = useTranslations("common");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  const [countries, setCountries] = useState<Country[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  // Use the page loading hook to show loading state in sidebar
  usePageLoading(loading);

  const getCountries = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * limit;
      const apiResponse = await fetchCountries(offset, limit, {
        countryId: filters.code,
        name: searchTerm || filters.name,
        phoneCode: filters.phoneCode,
      });
      const countryData = Array.isArray(apiResponse.countries)
        ? apiResponse.countries
        : [];
      setCountries(countryData);
      setTotalCount(apiResponse.total);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountries();
  }, [currentPage, filters, searchTerm]);

  const filteredCountries = countries;

  const columns: { header: string; accessor: keyof Country }[] = [
    { header: "id", accessor: "id" },
    { header: "country_name", accessor: "name" },
    { header: "country_code", accessor: "code" },
    { header: "phone_code", accessor: "phoneCode" },
    { header: "emoji", accessor: "emoji" },
    { header: "status", accessor: "isActive" },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Code", "Name", "Phone Code", "emoji"],
        ...filteredCountries.map((c) => [c.code, c.name, c.phoneCode, c.emoji]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "countries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderRowActions = (row: Country) => (
    <div className="flex gap-2">
      <Button
        icon={<Eye />}
        noBackground={true}
        textColor="blue-400"
        noLabel={true}
        href={`/dashboard/presets/locations/${row.code}`}
      />
    </div>
  );

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("presets"), href: "/dashboard/presets" },
    {
      label: t("countries"),
      href: "/dashboard/presets/locations",
    },
  ];

  return (
    <div>
      <PageHeader breadcrumbItems={breadcrumbItems} title={t("countries")} />

      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          {/* Search */}
          <SearchForm
            onSearch={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
          />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">
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
                label: t("country_code"),
                name: "code",
                placeholder: t("search_by_code"),
              },
              {
                type: "text",
                label: t("country_name"),
                name: "name",
                placeholder: t("search_by_name"),
              },
              {
                type: "text",
                label: t("phone_code"),
                name: "phoneCode",
                placeholder: t("search_by_phone_code"),
              },
            ]}
            onApply={(appliedFilters) => {
              setFilters(appliedFilters);
              setCurrentPage(1);
            }}
            onReset={() => {
              setFilters({});
              setCurrentPage(1);
            }}
          />
        )}
        <Table
          data={filteredCountries}
          columns={columns}
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalCount / limit),
            onPageChange: handlePageChange,
          }}
          rowsPerPage={10}
          renderRowActions={renderRowActions}
          isLoading={loading}
        />
      </div>

      <Popup
        isOpen={addPopupOpen}
        onClose={() => {
          setAddPopupOpen(false);
          getCountries();
        }}
      >
        <NewCountryForm
          title={t("add_country")}
          sub_title={t("form_subtitle")}
          onClose={() => {
            setAddPopupOpen(false);
            getCountries();
          }}
        />
      </Popup>
    </div>
  );
};

export default Countries;
