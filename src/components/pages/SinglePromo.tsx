"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import PageHeader from "../global/PageHeader";
import Button from "../ui/Button";
import GroupInfo from "../ui/GroupInfo";
import Popup from "../ui/Popup";
import { showToast } from "@/utils/toast";
import NewPromoForm from "../forms/NewPromoForm";
import { deletePromoCode, fetchPromoByCode } from "@/api/presetsService";
import { useRouter } from "@/i18n/routing";

interface PromoData {
    id: number;
    code: string;
    description: string;
    discountType: string;
    discountAmount: number;
    expiryDate: string;
    isActive: boolean;
    maxUsage: number;
    minimumOrderAmount: string;
    maximumDiscountAmount: string;
    usages: any[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface SinglePromoProps {
    promoData: PromoData;
    promoCode: string;
}

export default function SinglePromo({ promoData, promoCode }: SinglePromoProps) {
    const t = useTranslations("common");
    const tMsgs = useTranslations("messages");
    const [mainData, setMainData] = useState<PromoData>(promoData);
    const [addPopupOpen, setAddPopupOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const router = useRouter();

    // Placeholder for edit and delete handlers
    const handleClose = async () => {
        setAddPopupOpen(false);
        try {
            const newData = await fetchPromoByCode(promoCode);
            setMainData(newData.innerData);
        } catch (error) {
            console.error("Error refetching data:", error);
        }
    };

    const handleDelete = async () => {
        const result = await deletePromoCode(Number(promoData.id));
        if (result.success) {
            router.push("/dashboard/courses-management/rewards");
        } else {
            setError("Failed to delete branch.");
        }
        setShowDeleteConfirm(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    const breadcrumbItems = [
        { label: t("home"), href: "/" },
        { label: t("rewards_management"), href: "/dashboard/courses-management/rewards" },
        { label: t("promo_details"), href: `/dashboard/courses-management/rewards/${promoCode}` },
    ];

    if (error) return <div>{error}</div>;
    if (!promoData) return <div>{'no DATA'}</div>;
    return (
        <div className="h-full">
            <Popup isOpen={addPopupOpen} onClose={handleClose}>
                <NewPromoForm
                    title={t("edit_promo")}
                    sub_title={t("form_subtitle")}
                    onClose={handleClose}
                    promoData={promoData}
                />
            </Popup>
            <Popup isOpen={showDeleteConfirm} onClose={handleDeleteCancel}>
                <div>
                    <p className="p-5 text-center text-2xl">{t("are_you_sure_delete")}</p>
                    <div className="flex items-center justify-center gap-4">
                        <Button onClick={handleDelete} label={t("buttons.confirm")} />
                        <Button onClick={handleDeleteCancel} label={t("buttons.cancel")} variant="dark" />
                    </div>
                </div>
            </Popup>
            <PageHeader
                breadcrumbItems={breadcrumbItems}
                title={t("promo_details")}
                actions={
                    <>
                        <Button
                            label={t("buttons.edit")}
                            onClick={() => setAddPopupOpen(true)}
                            variant="primary"
                        />
                        <Button
                            label={t("buttons.delete")}
                            onClick={() => setShowDeleteConfirm(true)}
                            variant="danger"
                        />
                    </>
                }
            />
            <div className="content-height mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4">
                <h1 className="heading3">{t("promo_details")}</h1>
                <div className="flex gap-8 flex-col">
                    <div className="flex items-center justify-between gap-8 flex-wrap">
                        <GroupInfo label={t("promo_code")} content={mainData.code} copyIt />
                        <GroupInfo label={t("description")} content={mainData.description} />
                        <GroupInfo label={t("discount_type")} content={mainData.discountType} />
                    </div>
                    <div className="flex items-center justify-between gap-8 flex-wrap">

                        <GroupInfo label={t("discount_amount")} content={mainData.discountAmount} />
                        <GroupInfo label={t("expiry_date")} content={mainData.expiryDate} />
                        <GroupInfo label={t("is_active")} content={mainData.isActive ? t("yes") : t("no")} />
                    </div>
                    <div className="flex items-center justify-between gap-8 flex-wrap">
                        <GroupInfo label={t("max_usage")} content={mainData.maxUsage} />
                        <GroupInfo label={t("minimum_order_amount")} content={mainData.minimumOrderAmount} />
                        <GroupInfo label={t("maximum_discount_amount")} content={mainData.maximumDiscountAmount} />
                    </div>
                </div>
            </div>
        </div>
    );
}