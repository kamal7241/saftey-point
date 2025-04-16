export const runtime = "edge";
import { fetchRoleById } from "@/api/roleService";
import RoleView from "@/components/pages/RoleView";

export default async function Page({
  params,
}: {
  params: Promise<{ roleId: string }>;
}) {
  const roleId = (await params).roleId;
  const initialData = await fetchRoleById(roleId);

  return (
    <>
      <RoleView roleData={initialData} roleId={roleId} />
    </>
  );
}
