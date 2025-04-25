export const runtime = "edge";
import RoleView from "@/components/pages/RoleView";

export default async function Page({
  params,
}: {
  params: Promise<{ roleID: string }>;
}) {
  const roleID = (await params).roleID;
  return (
    <>
      <RoleView roleId={roleID} />
    </>
  );
}
