export const runtime = "edge";
import { fetchCountryByCode } from "@/api/countryService";
import SingleCountry from "@/components/pages/SingleCountry";

export default async function Page({
  params,
}: {
  params: Promise<{ countryID: string }>;
}) {
  const countryID = (await params).countryID;
  const response = await fetchCountryByCode(countryID);
  
  if (!response.success || !response.data) {
    throw new Error("Country not found");
  }

  return <SingleCountry countryData={response.data} countryID={countryID} />;
}
