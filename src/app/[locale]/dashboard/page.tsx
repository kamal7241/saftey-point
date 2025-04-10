export const runtime = "edge";

import Dashboard from "@/components/pages/Dashboard";

export default function Page() {
  return (
    <div>
      <Dashboard />
      <img src="/images/pages/dashboard.png" alt="Dashboard" className="mt-6" />
    </div>
  );
}
