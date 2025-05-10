"use client";
import MainPageLinksGrid, { MainPageLinkItem } from "@/components/ui/MainPageLinksGrid";

const links: MainPageLinkItem[] = [
    { name: "Companies", link: "/dashboard/company-management/companies" },
    { name: "Branches", link: "/dashboard/company-management/branches" },
];

export default function CompanyManagement() {
    return <MainPageLinksGrid title={'Company Management'} links={links} />;
}
