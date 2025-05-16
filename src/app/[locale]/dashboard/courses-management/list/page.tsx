"use client";
export const runtime = "edge";
import Courses from "@/components/pages/Courses";
import withAuthRole from "@/components/auth/withAuthRole";

function Page() {
  
  return (
    <>
      <Courses />
    </>
  );
}

export default withAuthRole(Page, ['admin']);
