export const runtime = "edge";
import { fetchComapnyById } from "@/api/companiesService";
import SingleCompany from "@/components/pages/SingleCompany";

export default async function Page({
  params,
}: {
  params: Promise<{ companyID: string }>;
}) {
  const { companyID } = await params;
  const companyData = await fetchComapnyById(companyID);

  return <SingleCompany companyData={companyData} />;
}
