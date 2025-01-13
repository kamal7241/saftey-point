export const runtime = "edge";
import SingleUser from "@/components/pages/SingleUser";

export default async function Page({
  params,
}: {
  params: Promise<{ userID: string }>;
}) {
  const userID = (await params).userID;
  return <SingleUser userID={userID} />;
}
