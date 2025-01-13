export const runtime = "edge";
import RoleView from "@/components/pages/RoleView";

export default async function Page({
  params,
}: {
  params: Promise<{ adminId: string }>;
}) {
  const adminId = (await params).adminId;
  return (
    <>
      <RoleView adminId={adminId} />
    </>
  );
}
