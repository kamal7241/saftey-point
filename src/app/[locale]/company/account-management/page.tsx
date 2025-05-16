"use client";
export const runtime = "edge";
import withAuthRole from "@/components/auth/withAuthRole";

function CompanyAccountManagementPage() {
  return (
    <div>
      <h1>Company Account Management Page</h1>
      <p>This is a placeholder for the company account management.</p>
    </div>
  );
}

export default withAuthRole(CompanyAccountManagementPage, ["company"]);