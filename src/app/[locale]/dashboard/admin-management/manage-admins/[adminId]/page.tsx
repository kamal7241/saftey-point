export const runtime = "edge";
import { fetchAdminById } from "@/api/adminService";
import SingleAdmin from "@/components/pages/SingleAdmin";
import SomethingWentWrong from "@/components/ui/SomethingWentWrong";

export default async function Page({
  params,
}: {
  params: Promise<{ adminId: string }>;
}) {
  const { adminId } = await params;
  const initialData = await fetchAdminById(adminId);

  if (!initialData || !initialData.admin) {
    console.error("Failed to load admin data:", initialData?.error);
    return <SomethingWentWrong />;
  }

  return (
    <SingleAdmin
      adminData={initialData.admin}
      adminID={adminId}
    />
  );
}
