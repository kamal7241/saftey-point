export const runtime = "edge";
import { fetchExamById } from "@/api/courseService";
import SingleExam from "@/components/pages/SingleExam";

export default async function Page({
  params,
}: {
  params: Promise<{ examID: string }>;
}) {
  const examID = (await params).examID;
  const response = await fetchExamById(examID);
  return <SingleExam examData={response.data} examID={examID} />;
}
