"use client";
export const runtime = "edge";
import withAuthRole from "@/components/auth/withAuthRole";

function CompanyEmployeeManagementPage() {
  return (
    <div>
      <h1>Company Employee Management Page</h1>
      <p>This is a placeholder for the company employee management.</p>
    </div>
  );
}

export default withAuthRole(CompanyEmployeeManagementPage, ["company"]);