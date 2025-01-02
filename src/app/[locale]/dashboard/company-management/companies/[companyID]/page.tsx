export const runtime = "edge";
import SingleCompany from "@/components/pages/SingleCompany";

export default async function Page({
  params,
}: {
  params: Promise<{ companyID: string }>;
}) {
  const companyID = (await params).companyID;
  return <SingleCompany companyID={companyID} />;
}
