/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { fetchCancellationFees, deleteCancellationFee } from "@/api/cancellationFeesService";
import Table from "@/components/ui/Table";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import NewCancellationFeeForm from "../forms/NewCancellationFeeForm";
import SearchForm from "../formsUI/SearchForm";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import { Add } from "../ui/icons/Add";
import { Export } from "../ui/icons/Export";
import Eye from "../ui/icons/Eye";
import { Edit } from "../ui/icons/Edit";
import { Delete } from "../ui/icons/Delete";
import Popup from "../ui/Popup";
import { showToast } from "@/utils/toast";
import { CancellationFee } from "@/types/ui.types";

const CancellationFees = () => {
    const t = useTranslations("common");
    const tMsgs = useTranslations("messages");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [cancellationFees, setCancellationFees] = useState<CancellationFee[]>([]);
    const [addPopupOpen, setAddPopupOpen] = useState(false);
    const [editPopupOpen, setEditPopupOpen] = useState(false);
    const [cancellationFeeToEdit, setCancellationFeeToEdit] = useState<CancellationFee | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [cancellationFeeToDelete, setCancellationFeeToDelete] = useState<number | null>(null);
    const [totalCount, setTotalCount] = useState(0);

    const limit = 10;

    const handleDelete = async () => {
        if (!cancellationFeeToDelete) return;

        try {
            const result = await deleteCancellationFee(cancellationFeeToDelete);
            if (result.success) {
                showToast.success(tMsgs('cancellation_fee_deleted_successfully'));
                await getCancellationFees();
            } else {
                console.error("Failed to delete cancellation fee:", result.message);
            }
        } catch (error) {
            console.error("Error deleting cancellation fee:", error);
        }
        setShowDeleteConfirm(false);
        setCancellationFeeToDelete(null);
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setCancellationFeeToDelete(null);
    };

    const handleExport = () => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            [
                [
                    "ID",
                    "Name",
                    "Description",
                    "Type",
                    "Percentage",
                    "Fixed Amount",
                    "Hours Before Start",
                    "Sort Order",
                    "Status",
                    "Created At",
                ],
                ...filteredCancellationFees.map((fee: CancellationFee) => [
                    fee.id,
                    fee.name,
                    fee.description,
                    fee.type,
                    fee.percentage || "N/A",
                    fee.fixedAmount || "N/A",
                    fee.hoursBeforeStart,
                    fee.sortOrder,
                    fee.isActive ? "Active" : "Inactive",
                    fee.createdAt,
                ]),
            ]
                .map((row) => row.join(","))
                .join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "cancellation-fees.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getCancellationFees = async () => {
        setLoading(true);
        const offset = (currentPage - 1) * limit;
        const response = await fetchCancellationFees(offset, limit);
        if (response.success) {
            setCancellationFees(
                response.innerData.cancellationFees.map((fee: any) => ({
                    ...fee,
                    name: fee.name,
                    createdAt: new Date(fee.createdAt).toDateString(),
                }))
            );
            setTotalCount(response.innerData.count);
        }
        setLoading(false);
    };

    useEffect(() => {
        getCancellationFees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const filteredCancellationFees = cancellationFees.filter((fee) => {
        const matchesSearch = fee.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const columns: { header: string; accessor: keyof CancellationFee }[] = [
        { header: t("tables.name"), accessor: "name" },
        { header: t("tables.description"), accessor: "description" },
        { header: t("tables.type"), accessor: "type" },
        { header: t("tables.percentage"), accessor: "percentage" },
        { header: t("tables.fixed_amount"), accessor: "fixedAmount" },
        { header: t("tables.hours_before_start"), accessor: "hoursBeforeStart" },
        { header: t("tables.sort_order"), accessor: "sortOrder" },
        { header: t("tables.status"), accessor: "isActive" },
        { header: t("tables.created"), accessor: "createdAt" },
    ];

    const renderRowActions = (row: CancellationFee) => (
        <div className="flex gap-2">
            <Button
                icon={<Eye />}
                noBackground={true}
                textColor="blue-400"
                noLabel={true}
                href={`/dashboard/presets/cancellation-fees/${row.id}`}
            />
            <Button
                icon={<Edit />}
                noBackground={true}
                textColor="gray-900"
                noLabel={true}
                onClick={() => {
                    setCancellationFeeToEdit(row);
                    setEditPopupOpen(true);
                }}
            />
            <Button
                icon={<Delete />}
                noBackground={true}
                textColor="red-500"
                noLabel={true}
                onClick={() => {
                    setCancellationFeeToDelete(row.id);
                    setShowDeleteConfirm(true);
                }}
            />
        </div>
    );

    const breadcrumbItems = [
        { label: t("home"), href: "/" },
        { label: t("presets"), href: "/dashboard/presets" },
        { label: t("cancellation_fees"), href: "/dashboard/presets/cancellation-fees" },
    ];

    return (
        <div>
            <PageHeader breadcrumbItems={breadcrumbItems} title={t("cancellation_fees")} />

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
                            label={t("buttons.add_cancellation_fee")}
                            onClick={() => setAddPopupOpen(true)}
                            icon={
                                <span className="w-6 inline-block">
                                    <Add />
                                </span>
                            }
                            variant="primary"
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

                <Table
                    data={filteredCancellationFees}
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
                    getCancellationFees();
                }}
            >
                <NewCancellationFeeForm
                    title={t("add_cancellation_fee")}
                    sub_title={t("add_cancellation_fee_subtitle")}
                    onClose={() => {
                        setAddPopupOpen(false);
                        getCancellationFees();
                    }}
                />
            </Popup>

            <Popup
                isOpen={editPopupOpen}
                onClose={() => {
                    setEditPopupOpen(false);
                    setCancellationFeeToEdit(null);
                    getCancellationFees();
                }}
            >
                <NewCancellationFeeForm
                    title={t("edit_cancellation_fee")}
                    sub_title={t("edit_cancellation_fee_subtitle")}
                    onClose={() => {
                        setEditPopupOpen(false);
                        setCancellationFeeToEdit(null);
                        getCancellationFees();
                    }}
                    cancellationFeeData={cancellationFeeToEdit}
                />
            </Popup>
        </div>
    );
};

export default CancellationFees; 