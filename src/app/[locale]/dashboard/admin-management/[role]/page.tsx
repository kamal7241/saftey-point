export const runtime = "edge";
import RoleView from "@/components/pages/RoleView";

export default async function Page({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const role = (await params).role;
  return (
    <>
      <RoleView roleId={role} />
    </>
  );
}
