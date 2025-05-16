"use client";
export const runtime = "edge";
import AddRole from "@/components/pages/AddRole";
import withAuthRole from "@/components/auth/withAuthRole";

function Page() {
  return (
    <>
      <AddRole />
    </>
  );
}

export default withAuthRole(Page, ['admin']);
