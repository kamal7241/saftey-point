export const runtime = "edge";
import { fetchPromoByCode } from "@/api/presetsService";
import SinglePromo from "@/components/pages/SinglePromo";

export default async function Page({
  params,
}: {
  params: Promise<{ rewardCode: string }>;
}) {
  const rewardCode = (await params).rewardCode;
  const result = await fetchPromoByCode(rewardCode);
  return <SinglePromo promoData={result.innerData} promoCode={rewardCode} />;
}
