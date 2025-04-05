export const runtime = "edge";
import { fetchComapnyById } from "@/api/companiesService";
import SingleCompany from "@/components/pages/SingleCompany";

export default async function Page({
  params,
}: {
  params: Promise<{ companyID: string }>;
}) {
  const { companyID } = await params;
  
  // Fetch initial data
  const initialData = await fetchComapnyById(companyID);
  
  return <SingleCompany companyData={initialData} companyID={companyID} />;
}
