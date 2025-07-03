"use client";
export const runtime = "edge";

import Dashboard from "@/components/pages/Dashboard";
import withAuthRole from "@/components/auth/withAuthRole";

function Page() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default withAuthRole(Page, ['admin']);
