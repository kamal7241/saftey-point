import SingleCourseType from "@/components/pages/SingleCourseType";

interface SingleCourseTypePageProps {
  params: {
    courseTypeId: string;
  };
}

export default function SingleCourseTypePage({ params }: SingleCourseTypePageProps) {
  return <SingleCourseType courseTypeId={params.courseTypeId} />;
} 