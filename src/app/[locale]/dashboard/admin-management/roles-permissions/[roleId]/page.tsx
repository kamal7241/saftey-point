export const runtime = "edge";
import RoleView from "@/components/pages/RoleView";

export default async function Page({
  params,
}: {
  params: Promise<{ roleId: string }>;
}) {
  const roleId = (await params).roleId;
  return (
    <>
      <RoleView roleId={roleId} />
    </>
  );
}
