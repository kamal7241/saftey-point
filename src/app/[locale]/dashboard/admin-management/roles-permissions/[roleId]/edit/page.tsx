export const runtime = "edge";
import RoleView from "@/components/pages/RoleView";

export default async function EditRolePage({
  params,
}: {
  params: Promise<{ roleId: string }>;
}) {
  const roleId = (await params).roleId;
  return (
    <>
      <RoleView roleId={roleId} isEditing={true} />
    </>
  );
}
