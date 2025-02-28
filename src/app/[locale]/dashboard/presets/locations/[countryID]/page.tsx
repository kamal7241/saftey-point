export const runtime = "edge";
import SingleCountry from "@/components/pages/SingleCountry";

export default async function Page({
  params,
}: {
  params: Promise<{ countryID: string }>;
}) {
  const countryID = (await params).countryID;
  return <SingleCountry countryID={countryID} />;
}
