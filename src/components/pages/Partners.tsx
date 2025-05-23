/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { fetchPartners } from "@/api/partnerService";
import Table from "@/components/ui/Table";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import NewPartnerForm from "../forms/NewPartnerForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Add } from "../ui/icons/Add";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import Popup from "../ui/Popup";

const Partners = () => {
    const t = useTranslations("common");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [partners, setPartners] = useState<any[]>([]);
    const [addPopupOpen, setAddPopupOpen] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState<{ [key: string]: string | undefined }>({});

    const limit = 10;

    const handleExport = () => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            [
                [
                    "ID",
                    "Name",
                    "Website",
                    "Status",
                    "Created At",
                ],
                ...filteredPartners.map((p: any) => [
                    p.id,
                    p.name,
                    p.website,
                    p.status === "1" ? "Active" : "Inactive",
                    p.createdAt,
                ]),
            ]
                .map((row) => row.join(","))
                .join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "partners.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getPartners = async () => {
        setLoading(true);
        const offset = (currentPage - 1) * limit;
        const response = await fetchPartners(offset, limit);
        if (response.success) {
            setPartners(
                response.innerData.partners.map((partner: any) => ({
                    ...partner,
                    name: partner.name,
                    createdAt: new Date(partner.createdAt).toDateString(),
                    status: partner.deletedAt ? "0" : "1",
                }))
            );
            setTotalCount(response.innerData.count);
        }
        setLoading(false);
    };

    useEffect(() => {
        getPartners();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const filteredPartners = partners.filter((partner) => {
        const matchesSearch = partner.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesFilters = Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            return partner[key as keyof any]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase());
        });
        return matchesSearch && matchesFilters;
    });

    const columns: { header: string; accessor: keyof any }[] = [
        { header: "name", accessor: "name" },
        { header: "website", accessor: "website" },
        { header: "created", accessor: "createdAt" },
    ];

    const handleApplyFilters = (appliedFilters: { [key: string]: string }) => {
        setFilters(appliedFilters);
    };

    const handleResetFilters = () => {
        setFilters({});
    };

    const renderRowActions = (row: any) => (
        <div className="flex gap-2">
            <Button
                icon={<Eye />}
                noBackground={true}
                textColor="blue-400"
                noLabel={true}
                href={`/dashboard/presets/partners/${row.id}`}
            />
        </div>
    );

    const breadcrumbItems = [
        { label: t("home"), href: "/" },
        { label: t("presets"), href: "/dashboard/presets" },
        { label: t("partner"), href: "/dashboard/presets/partners" },
    ];

    return (
        <div>
            <PageHeader breadcrumbItems={breadcrumbItems} title={t("partners")} />
            <div className="mt-6 bg-white rounded-2xl">
                <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
                    <SearchForm onSearch={setSearchTerm} />
                    <div className="flex gap-3 justify-between items-stretch flex-wrap">
                        <Button
                            label={t("buttons.add_partner")}
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
                                placeholder: "Partner Name",
                            }
                        ]}
                        onApply={handleApplyFilters}
                        onReset={handleResetFilters}
                    />
                )}

                <Table
                    data={filteredPartners}
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
                    getPartners();
                }}
            >
                <NewPartnerForm
                    title={t("add_partner")}
                    sub_title={t("form_subtitle")}
                    onClose={() => {
                        setAddPopupOpen(false);
                        getPartners();
                    }}
                />
            </Popup>
        </div>
    );
};

export default Partners;