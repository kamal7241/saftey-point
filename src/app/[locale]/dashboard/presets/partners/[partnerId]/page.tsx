export const runtime = "edge";
import { fetchPartnerById } from "@/api/partnerService";
import SinglePartner from "@/components/pages/SinglePartner";

export default async function Page({
  params,
}: {
  params: Promise<{ partnerId: string }>;
}) {
  const { partnerId } = await params;
  const response = await fetchPartnerById(partnerId);

  if (!response.success || !response.data) {
    return <div>Error loading facility data.</div>;
  }

  return <SinglePartner partnerData={response.data} partnerID={partnerId} />;
}