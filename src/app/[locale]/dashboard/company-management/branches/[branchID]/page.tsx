export const runtime = "edge";
import { fetchBranchById } from "@/api/companiesService";
import SingleBranch from "@/components/pages/SingleBranch";

export default async function Page({
  params,
}: {
  params: Promise<{ branchID: string }>;
}) {
  const branchID = (await params).branchID;
  // Fetch initial data
  const initialData = await fetchBranchById(branchID);
  return <SingleBranch branchData={initialData} branchID={branchID} />;
}
