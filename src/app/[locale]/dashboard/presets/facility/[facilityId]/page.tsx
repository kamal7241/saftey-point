export const runtime = "edge";
import { fetchFacilityById } from "@/api/presetsService";
import SingleFacility from "@/components/pages/SingleFacility";

export default async function Page({
  params,
}: {
  params: Promise<{ facilityId: string }>;
}) {
  const { facilityId } = await params;
  const response = await fetchFacilityById(facilityId);

  if (!response.success || !response.data) {
    return <div>Error loading facility data.</div>;
  }

  return <SingleFacility facilityData={response.data} facilityID={facilityId} />;
}