"use client"; // Add "use client" because HOCs with hooks need to be client components
export const runtime = "edge";
import ManageAdmins from "@/components/pages/ManageAdmins";
import withAuthRole from "@/components/auth/withAuthRole";

function ManageAdminsPage() {
  return (
    <>
      <ManageAdmins />
    </>
  );
}

// Wrap the page component with the HOC, allowing only 'admin' role
export default withAuthRole(ManageAdminsPage, ['admin']);
