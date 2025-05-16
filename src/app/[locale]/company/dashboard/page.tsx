"use client";
export const runtime = "edge";
import withAuthRole from "@/components/auth/withAuthRole";

function CompanyDashboardPage() {
  return (
    <div>
      <h1>Company Dashboard Page</h1>
      <p>This is a placeholder for the company dashboard.</p>
    </div>
  );
}

export default withAuthRole(CompanyDashboardPage, ["company"]);