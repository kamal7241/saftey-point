export const runtime = "edge";
import NotDevelopedYet from "@/components/NotDevelopedYet";

export default async function Page({
  params,
}: {
  params: Promise<{ rewardID: string }>;
}) {
  const rewardID = (await params).rewardID;
  // Fetch initial data
  // const initialData = await fetchBranchById(rewardID);
  console.log(rewardID);
  return <NotDevelopedYet/>;
}
