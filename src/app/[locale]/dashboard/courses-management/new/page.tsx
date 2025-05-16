"use client";
export const runtime = "edge";
import CreateCourse from "@/components/pages/CreateCourse";
import withAuthRole from "@/components/auth/withAuthRole";

function Page() {
  return (
    <div>
      <CreateCourse />
    </div>
  );
}

export default withAuthRole(Page, ['admin']);
