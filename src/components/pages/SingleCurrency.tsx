"use client";
import { Currency } from "@/types/ui.types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Status from "../ui/Status";
import { Delete } from "../ui/icons/Delete";
import Edit2 from "../ui/icons/Edit2";
import { useRouter } from "@/i18n/routing";
import { deleteCurrency, fetchCurrencyById } from "@/api/presetsService";
import Popup from "../ui/Popup";
import { showToast } from "@/utils/toast";
import MoneyIcon from "../ui/icons/MoneyIcon";
import CodeIcon from "../ui/icons/CodeIcon";
import StatusCheck from "../ui/icons/StatusCheck";
import NewCurrencyForm from "../forms/NewCurrencyForm";

interface SingleCurrencyProps {
    currencyData: Currency;
    currencyID: string;
}

export default function SingleCurrency({ currencyData, currencyID }: SingleCurrencyProps) {
    const t = useTranslations("common");
    const tMsgs = useTranslations("messages");
    const [currencyDetails, setCurrencyDetails] = useState<Currency>(currencyData);
    const [addPopupOpen, setAddPopupOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const router = useRouter();

    const handleClose = async () => {
        setAddPopupOpen(false);
        try {
            const response = await fetchCurrencyById(currencyID);
            if (response.success) {
                setCurrencyDetails(response.data);
            }
        } catch (error) {
            console.error("Error refetching data:", error);
        }
    };

    const handleDelete = async () => {
        const result = await deleteCurrency(Number(currencyDetails?.id));
        if (result.success) {
            showToast.success(tMsgs("currency_deleted_successfully"));
            router.push("/dashboard/presets/currencies");
        } else {
            setError(result.message || "Failed to delete currency.");
        }
        setShowDeleteConfirm(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    const breadcrumbItems = [
        { label: t("home"), href: "/" },
        { label: t("presets"), href: "/dashboard/presets" },
        { label: t("currencies"), href: "/dashboard/presets/currencies" },
        { label: currencyDetails?.name || "", href: "#" },
    ];

    if (!currencyDetails) return <div>{t("error_loading_data")}</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="h-full">
            <Popup isOpen={addPopupOpen} onClose={handleClose}>
                <NewCurrencyForm
                    title={t("edit_currency")}
                    sub_title={t("form_subtitle")}
                    onClose={handleClose}
                    // currencyData={currencyDetails}
                />
            </Popup>

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

            <PageHeader
                breadcrumbItems={breadcrumbItems}
                title={t("currency_details")}
                actions={
                    <>
                        <Button
                            label={t("buttons.edit")}
                            onClick={() => setAddPopupOpen(true)}
                            icon={
                                <span className="inline-block w-6">
                                    <Edit2 />
                                </span>
                            }
                            variant="primary"
                        />
                        <Button
                            label={t("buttons.delete")}
                            onClick={() => setShowDeleteConfirm(true)}
                            icon={
                                <span className="inline-block w-6">
                                    <Delete />
                                </span>
                            }
                            variant="danger"
                        />
                    </>
                }
            />

            <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
                <h1 className="heading3">{t("currency_details")}</h1>
                <div className="grid grid-cols-3 gap-6">
                    <GroupInfo
                        label={t("currencyName")}
                        content={currencyDetails.name}
                        icon={<CodeIcon />}
                    />
                    <GroupInfo
                        label={t("exchange_rate")}
                        content={currencyDetails.exchangeRate.toString()}
                        icon={<MoneyIcon />}
                    />
                    <GroupInfo
                        label={t("symbol")}
                        content={currencyDetails.symbol}
                        icon={<MoneyIcon />}
                    />
                    <GroupInfo
                        label={t("code")}
                        content={currencyDetails.code}
                        icon={<CodeIcon />}
                    />
                    <GroupInfo
                        label={t("created")}
                        content={ new Date(currencyDetails.createdAt).toDateString()}
                        icon={<CodeIcon />}
                    />
                    <GroupInfo
                        label={t("status")}
                        content={
                            <Status status={currencyDetails.isActive ? "1" : "0"} />
                        }
                        icon={<StatusCheck />}
                    />
                </div>
            </div>
        </div>
    );
}