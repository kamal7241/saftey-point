"use client";
import { fetchCountries } from "@/api/presetsService";
import Table from "@/components/ui/Table";
import { Country } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import Popup from "../ui/Popup";
import { Add } from "../ui/icons/Add";
import NewCountryForm from "../forms/NewCountryForm";


const Countries = () => {
  const t = useTranslations("common");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addPopupOpen, setAddPopupOpen] = useState(false);

  const [countries, setCountries] = useState<Country[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {}
  );

  const getCountries = async () => {
    const response = await fetchCountries();
    const data = await response.countries;
    setCountries(data);
  };
  useEffect(() => {

    getCountries();
  }, []);

  const filteredCountries = countries.filter((certificate) => {
    const matchesSearch = certificate.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return certificate[key as keyof Country]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  const columns: { header: string; accessor: keyof Country }[] = [
    { header: "country_name", accessor: "name" },
    { header: "country_code", accessor: "code" },
    { header: "phone_code", accessor: "phoneCode" },
    { header: "emoji", accessor: "emoji" },
  ];

  const totalPages = Math.ceil(filteredCountries.length / 10);

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
          "Code",
          "Name",
          "Phone Code",
          "emoji",
        ],
        ...filteredCountries.map((c) => [
          c.code,
          c.name,
          c.phoneCode,
          c.emoji,
          // c.employees,
          // c.created,
        ]),
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
    { label: t("user-management"), href: "/dashboard/user-management" },
    {
      label: t("countries"),
      href: "/dashboard/presets/locations",
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={t("countries")}
      />

      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          {/* Search */}
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">
            <Button
              label={t("buttons.add_country")}
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
                label: "Code",
                name: "code",
                placeholder: t('search_by_code'),
              },
              {
                type: "text",
                label: "Name",
                name: "name",
                placeholder: t('search_by_name'),
              },
              {
                type: "text",
                label: "Phone Code",
                name: "phoneCode",
                placeholder: t('search_by_phone_code'),
              },
              {
                type: "text",
                label: "Emoji",
                name: "emoji",
                placeholder: t('search_by_emoji'),
              },
            ]}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
        <Table
          data={filteredCountries}
          columns={columns}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange,
          }}
          rowsPerPage={10}
          renderRowActions={renderRowActions}
        />
      </div>


      <Popup isOpen={addPopupOpen}
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
