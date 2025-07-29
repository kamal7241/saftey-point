export const runtime = "edge";
import SingleStaff from "@/components/pages/SingleStaff";
import { fetchStaffById } from "@/api/staffService";

export default async function Page({
  params,
}: {
  params: Promise<{ staffID: string }>;
}) {
  const { staffID } = await params;
  const userData = await fetchStaffById(Number(staffID));

  // If server-side fetch fails, pass null to let client-side handle it
  return <SingleStaff staffData={userData} staffId={staffID} />;
}
