import { useTranslations } from "next-intl";
import PageHeader from "../global/PageHeader";

export default function Dashboard() {

    const t = useTranslations("common");
    const breadcrumbItems = [
        { label: t("home"), href: "/" },
        { label: t("dashboard"), href: "/dashboard" },
    ];
    return (
        <div>
            <PageHeader
                breadcrumbItems={breadcrumbItems}
                title={t("dashboard")}
            />
        </div>
    );
}
