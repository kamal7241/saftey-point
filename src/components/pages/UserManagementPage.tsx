"use client";
import MainPageLinksGrid, { MainPageLinkItem } from "@/components/ui/MainPageLinksGrid";

const presetLinks: MainPageLinkItem[] = [
    { "name": "Users", "link": "/dashboard/user-management/users" },
    { "name": "Certificates", "link": "/dashboard/user-management/certificates" },
    { "name": "Exams", "link": "/dashboard/user-management/exams" },
    { "name": "Rewards", "link": "/dashboard/user-management/rewards" }
];

export default function UserManagementPage() {
    return <MainPageLinksGrid title="User Management" links={presetLinks} />;
}
