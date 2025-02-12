export const runtime = "edge";
import SingleCourse from "@/components/pages/SingleCourse";

export default async function Page({
  params,
}: {
  params: Promise<{ courseID: string }>;
}) {
  const courseID = (await params).courseID;
  return <SingleCourse courseID={courseID} />;
}
