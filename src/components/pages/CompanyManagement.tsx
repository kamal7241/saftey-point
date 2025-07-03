"use client";
import { useTranslations } from "next-intl";
import PageHeader from "../global/PageHeader";
import Companies from "./Companies";

export default function CompanyManagement() {
    const t = useTranslations("common");
    
    const breadcrumbItems = [
        { label: t("home"), href: "/" },
        { label: t("company-management"), href: "/dashboard/company-management" }
    ];

    return (
        <div>
            <PageHeader
                title={t("company-management")}
                breadcrumbItems={breadcrumbItems}
            />
            <Companies />
        </div>
    );
}
