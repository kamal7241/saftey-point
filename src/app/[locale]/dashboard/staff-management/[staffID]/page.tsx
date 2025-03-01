export const runtime = "edge";
import SingleStaff from "@/components/pages/SingleStaff";
import { fetchStaffById } from "@/api/dashboardService";

interface PageProps {
  params: {
    staffID: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { staffID } = params;
  const staffData = await fetchStaffById(Number(staffID));

  return <SingleStaff staffData={staffData} />;
}
