"use client";
import ManageRoles from "@/components/pages/ManageRoles";
import withAuthRole from "@/components/auth/withAuthRole";

export const runtime = "edge";

function Page() {
  return <ManageRoles />;
}

export default withAuthRole(Page, ['admin']);
