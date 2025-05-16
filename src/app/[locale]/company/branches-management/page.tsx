"use client";
export const runtime = "edge";
import withAuthRole from "@/components/auth/withAuthRole";

function CompanyBranchesManagementPage() {
  return (
    <div>
      <h1>Company Branches Management Page</h1>
      <p>This is a placeholder for the company branches management.</p>
    </div>
  );
}

export default withAuthRole(CompanyBranchesManagementPage, ["company"]);