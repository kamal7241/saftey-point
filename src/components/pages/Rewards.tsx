/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { fetchPromoCodes } from "@/api/presetsService";
import Table from "@/components/ui/Table";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";

interface PromoCode {
  id: number;
  code: string;
  description: string;
  discountType: string;
  discountAmount: number;
  expiryDate: string;
  maxUsage: number;
  isActive: boolean;
  createdAt: string;
}

const Rewards = () => {
  const t = useTranslations("common");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>({});

  const limit = 10;
  const getPromoCodes = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;
    const response = await fetchPromoCodes(offset, limit);
    if (response.success) {
      setPromoCodes(
        response.innerData.items.map((promo: any) => ({
          id: promo.id,
          code: promo.code,
          description: promo.description,
          discountType: promo.discountType,
          discountAmount: promo.discountAmount,
          expiryDate: new Date(promo.expiryDate).toDateString(),
          maxUsage: promo.maxUsage,
          isActive: promo.isActive,
          createdAt: new Date(promo.createdAt).toDateString(),
        }))
      );
      setTotalCount(response.innerData.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPromoCodes();
  }, [currentPage]);

  const filteredPromoCodes = promoCodes.filter((promo) => {
    const matchesSearch = promo.code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return promo[key as keyof PromoCode]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  const columns = [
    { header: "id", accessor: "id" },
    { header: "code", accessor: "code" },
    { header: "description", accessor: "description" },
    { header: "discountType", accessor: "discountType" },
    { header: "discountAmount", accessor: "discountAmount" },
    { header: "expiryDate", accessor: "expiryDate" },
    { header: "maxUsage", accessor: "maxUsage" },
    { header: "status", accessor: "isActive" },
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
        ["ID", "Code", "Description", "Discount Type", "Discount Amount", "Expiry Date", "Max Usage"],
        ...filteredPromoCodes.map((p) => [
          p.id,
          p.code,
          p.description,
          p.discountType,
          p.discountAmount,
          p.expiryDate,
          p.maxUsage,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "promo_codes.csv");
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
        onClick={() => handleView(row.id)}
      />
    </div>
  );

  const handleView = (id: number) => {
    router.push(`/dashboard/courses-management/rewards/${id}`);
  };

  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("courses-management"), href: "/dashboard/courses-management" },
    { label: t("rewards"), href: "/dashboard/courses-management/rewards" },
  ];

  return (
    <div>
      <PageHeader breadcrumbItems={breadcrumbItems} title={t("rewards")} />

      <div className="mt-6 bg-white rounded-2xl">
        <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
          <SearchForm onSearch={setSearchTerm} />
          <div className="flex gap-3 justify-between items-stretch flex-wrap">
            <Button
              label={t("buttons.filters")}
              onClick={() => setFiltersOpen((prev) => !prev)}
              variant={!filtersOpen ? "transparent" : "selected"}
            />
            <Button
              label={t("buttons.export")}
              onClick={handleExport}
              variant="dark"
              icon={<Export />}
            />
          </div>
        </div>

        {filtersOpen && (
          <FilterForm
            fields={[
              {
                type: "text",
                label: "Promo ID",
                name: "id",
                placeholder: "Promo ID",
              },
              {
                type: "text",
                label: "Code",
                name: "code",
                placeholder: "Code",
              },
              {
                type: "select",
                label: "Status",
                placeholder: "Status",
                name: "isActive",
                options: [
                  { value: "true", label: "Active" },
                  { value: "false", label: "Inactive" },
                ],
              },
            ]}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}

        <Table
          data={filteredPromoCodes}
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
    </div>
  );
};

export default Rewards;