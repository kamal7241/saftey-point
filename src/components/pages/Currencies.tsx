"use client";
import { fetchCurrencies } from "@/api/presetsService";
import { useRouter } from "@/i18n/routing";
import { Currency } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import FilterForm from "../ui/FilterForm";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import { Delete } from "../ui/icons/Delete";
import { showToast } from "@/utils/toast";
import { deleteCurrency } from "@/api/presetsService";
import Table from "@/components/ui/Table";

// Add this to imports
import { Add } from "../ui/icons/Add";
import Popup from "../ui/Popup";
import NewCurrencyForm from "../forms/NewCurrencyForm";

const Currencies = () => {
    const t = useTranslations("common");
    const router = useRouter();
    const tMsgs = useTranslations("messages");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currencyToDelete, setCurrencyToDelete] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [addPopupOpen, setAddPopupOpen] = useState(false);
    const [filters, setFilters] = useState<{ [key: string]: string | undefined }>({});

    const getCurrencies = async () => {
        const response = await fetchCurrencies();
        if (response.success) {
            setCurrencies(response.innerData.currencies.map((currency: Currency) => ({
                ...currency,
                status: currency.isActive ? "1" : "0",
                createdAt: new Date(currency.createdAt).toDateString()
            })));
        }
    };
    useEffect(() => {
        getCurrencies();
    }, []);

    const filteredCurrencies = currencies.filter((currency) => {
        const matchesSearch = currency.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesFilters = Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            return currency[key as keyof Currency]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase());
        });
        return matchesSearch && matchesFilters;
    });

    const columns: { header: string; accessor: keyof Currency }[] = [
        { header: "name", accessor: "name" },
        { header: "exchange_rate", accessor: "exchangeRate" },
        { header: "symbol", accessor: "symbol" },
        { header: "code", accessor: "code" },
        { header: "created", accessor: "createdAt" },
        { header: "status", accessor: "status", },
    ];

    const totalPages = Math.ceil(filteredCurrencies.length / 10);

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
                ["Name", "Code", "Symbol", "Exchange Rate", "Status"],
                ...filteredCurrencies.map((c) => [
                    c.name,
                    c.code,
                    c.symbol,
                    c.exchangeRate,
                    c.isActive ? "Active" : "Inactive",
                ]),
            ]
                .map((row) => row.join(","))
                .join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "currencies.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async () => {
        if (!currencyToDelete) return;

        try {
            const result = await deleteCurrency(currencyToDelete);
            if (result.success) {
                showToast.success(tMsgs('currency_deleted_successfully'));
                await getCurrencies();
            } else {
                console.error("Failed to delete currency:");
            }
        } catch (error) {
            console.error("Error deleting currency:", error);
        }
        setShowDeleteConfirm(false);
        setCurrencyToDelete(null);
    };
    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setCurrencyToDelete(null);
    };

    const handleView = (id: number) => {
        router.push(`/dashboard/presets/currencies/${id}`);
    };

    const renderRowActions = (row: Currency) => (
        <div className="flex gap-2">
            <Button
                icon={<Eye />}
                noBackground={true}
                textColor="blue-400"
                noLabel={true}
                onClick={() => handleView(row.id)}
            />
            <Button
                icon={<Delete />}
                noBackground={true}
                textColor="red-500"
                noLabel={true}
                onClick={() => {
                    setCurrencyToDelete(row.id);
                    setShowDeleteConfirm(true);
                }}
            />
        </div>
    );

    const breadcrumbItems = [
        { label: t("home"), href: "/" },
        { label: t("presets"), href: "/dashboard/presets" },
        { label: t("currencies"), href: "/dashboard/presets/currencies" },
    ];

    return (
        <div>
            <PageHeader breadcrumbItems={breadcrumbItems} title={t("currencies")} />


            {showDeleteConfirm && (
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
            )}
            <div className="mt-6 bg-white rounded-2xl">
                <div className="flex justify-between items-center p-4 flex-wrap-reverse gap-6">
                    <SearchForm onSearch={setSearchTerm} />
                    <div className="flex gap-3 justify-between items-stretch flex-wrap">
                        <Button
                            label={t("buttons.add_currency")}
                            onClick={() => setAddPopupOpen(true)}
                            icon={<span className="w-6 inline-block"><Add /></span>}
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
                            icon={<span className="w-6 inline-block"><Export /></span>}
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
                                placeholder: "Currency Name",
                            },
                            {
                                type: "text",
                                label: "Code",
                                name: "code",
                                placeholder: "Currency Code",
                            },
                            {
                                type: "select",
                                label: "Status",
                                name: "isActive",
                                placeholder: "Status",
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
                    data={filteredCurrencies}
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

            <Popup isOpen={addPopupOpen} onClose={() => {
                setAddPopupOpen(false);
                getCurrencies();
            }}>
                <NewCurrencyForm
                    title={t("add_currency")}
                    sub_title={t("add_currency_subtitle")}
                    onClose={() => {
                        setAddPopupOpen(false);
                        getCurrencies();
                    }}
                />
            </Popup>
        </div>
    );
};

export default Currencies;