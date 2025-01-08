export const runtime = "edge";
import SingleBranch from "@/components/pages/SingleBranch";

export default async function Page({
  params,
}: {
  params: Promise<{ branchID: string }>;
}) {
  const branchID = (await params).branchID;
  return <SingleBranch branchID={branchID} />;
}
