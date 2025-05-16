"use client";
export const runtime = "edge";
import Certificates from "@/components/pages/Certificates";
import withAuthRole from "@/components/auth/withAuthRole";

function Page() {
  
  return (
    <>
      <Certificates />
    </>
  );
}

export default withAuthRole(Page, ['admin']);
