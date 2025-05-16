"use client";
export const runtime = "edge";
import Exams from "@/components/pages/Exams";
import withAuthRole from "@/components/auth/withAuthRole";

function Page() {
  return (
    <div>
      <Exams />
    </div>
  );
}

export default withAuthRole(Page, ['admin']);
