"use client";
import PresetsPage from "@/components/pages/PresetsPage";
import withAuthRole from "@/components/auth/withAuthRole";

export const runtime = "edge";

function Page() {
    return (
        <PresetsPage />
    );
}

export default withAuthRole(Page, ['admin']);
