"use client";
export const runtime = "edge";
import CompanyManagement from "@/components/pages/CompanyManagement";
import withAuthRole from "@/components/auth/withAuthRole";

function Page() {
  return (
    <CompanyManagement />
  );
}

export default withAuthRole(Page, ['admin']);
