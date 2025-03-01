export const runtime = "edge";
import SingleStaff from "@/components/pages/SingleStaff";
import { fetchStaffById } from "@/api/dashboardService";

export default async function Page({
  params,
}: {
  params: Promise<{ staffID: string }>;
}) {
  const { staffID } = await params;
  const staffData = await fetchStaffById(Number(staffID));

  return <SingleStaff staffData={staffData} />;
}
