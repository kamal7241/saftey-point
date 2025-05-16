"use client";
export const runtime = "edge";
import StaffManagement from "@/components/pages/StaffManagement";
import withAuthRole from "@/components/auth/withAuthRole";


function Page() {
  return (
    <div>
      <StaffManagement />
    </div>
  );
}

export default withAuthRole(Page, ['admin']);
