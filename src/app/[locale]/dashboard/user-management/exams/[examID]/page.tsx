export const runtime = "edge";
import SingleExam from "@/components/pages/SingleExam";

export default async function Page({
  params,
}: {
  params: Promise<{ examID: string }>;
}) {
  const examID = (await params).examID;
  return <SingleExam examID={examID} />;
}
