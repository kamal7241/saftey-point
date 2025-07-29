import SingleCourseType from "@/components/pages/SingleCourseType";

interface SingleCourseTypePageProps {
  params: Promise<{
    courseTypeId: string;
  }>;
}

export default async function SingleCourseTypePage({ params }: SingleCourseTypePageProps) {
  const { courseTypeId } = await params;
  return <SingleCourseType courseTypeId={courseTypeId} />;
} 