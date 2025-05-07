export const runtime = "edge";
import NotDevelopedYet from "@/components/NotDevelopedYet";

export default async function Page({
  params,
}: {
  params: Promise<{ rewardCode: string }>;
}) {
  const rewardCode = (await params).rewardCode;
  // Fetch initial data
  // const initialData = await fetchBranchById(rewardCode);
  console.log(rewardCode);
  return <NotDevelopedYet />;
}
