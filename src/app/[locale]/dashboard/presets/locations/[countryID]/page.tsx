export const runtime = "edge";
import { fetchCountryByCode } from "@/api/presetsService";
import SingleCountry from "@/components/pages/SingleCountry";

export default async function Page({
  params,
}: {
  params: Promise<{ countryID: string }>;
}) {
  const countryID = (await params).countryID;
  const response = await fetchCountryByCode(countryID);
  return <SingleCountry countryID={countryID} countryData={response.data} />;
}
