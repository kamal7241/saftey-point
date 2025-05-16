"use client";
export const runtime = "edge";
import UserManagementPage from "@/components/pages/UserManagementPage";
import withAuthRole from "@/components/auth/withAuthRole";


function Page() {
    return (
        <UserManagementPage />
    );
}

export default withAuthRole(Page, ['admin']);
