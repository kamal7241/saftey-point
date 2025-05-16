"use client";
export const runtime = "edge";

import Dashboard from "@/components/pages/Dashboard";
import withAuthRole from "@/components/auth/withAuthRole";

function Page() {
  return (
    <div>
      <Dashboard />
      <img src="/images/pages/dashboard.png" alt="Dashboard" className="mt-6" />
    </div>
  );
}

export default withAuthRole(Page, ['admin']);
