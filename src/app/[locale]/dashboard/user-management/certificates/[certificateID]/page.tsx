export const runtime = "edge";
import SingleCertificate from "@/components/pages/SingleCertificate";

export default async function Page({
  params,
}: {
  params: Promise<{ certificateID: string }>;
}) {
  const certificateID = (await params).certificateID;
  return <SingleCertificate certificateID={certificateID} />;
}
