"use client";
export const runtime = "edge";
import withAuthRole from "@/components/auth/withAuthRole";

function CompanyCoursesEnrollmentsPage() {
  return (
    <div>
      <h1>Company Courses Enrollments Page</h1>
      <p>This is a placeholder for the company courses enrollments.</p>
    </div>
  );
}

export default withAuthRole(CompanyCoursesEnrollmentsPage, ["company"]);